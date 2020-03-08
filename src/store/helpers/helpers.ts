import Tab = browser.tabs.Tab;
import Window = browser.windows.Window;
import {
    Project,
    ProjectsStorage,
    SearchedOpenTabResult,
    SearchedProject,
    SearchedProjectResult,
    SearchedProjectTab,
    TabClean,
    WindowClean,
} from '@/typings';
import { startsWith } from 'lodash-es';

// clean url from suspender extension additions
export const cleanUrl = (url: string) => {
    const urlTargetIndex = url.indexOf('http');
    return url.substring(urlTargetIndex);
};

export const cleanTab = (tab: Tab): TabClean => {
    return {
        id: tab.id || 0,
        title: tab.title || '',
        url: tab.url ? cleanUrl(tab.url) : '',
        active: tab.active || false,
        windowId: tab.windowId || 0,
    };
};

export const cleanWindow = (window: Window): WindowClean => {
    const cleanTabs = window.tabs?.map(tab => cleanTab(tab)) || [];

    return {
        id: window.id || 0,
        tabs: cleanTabs,
    };
};

export const packProjectForStorage = (project: Project): ProjectsStorage => {
    return {
        [makeStorageProjectId(project.id)]: {
            name: project.name,
            tabs: project.tabs,
        },
    };
};

export const unpackProjectFromStorage = (
    projectsStorage: ProjectsStorage
): Project[] => {
    const ids = Object.keys(projectsStorage).filter(id => startsWith(id, 'p_'));

    return ids.map(id => {
        return {
            id: makeProjectIdFromStorage(id),
            ...projectsStorage[id],
        };
    });
};

export const makeStorageProjectId = (projectId: number): string => {
    return 'p_' + projectId;
};

export const makeProjectIdFromStorage = (storageProjectId: string): number => {
    // from 'p_123' turn into 123
    // todo: consider optimizing with regex
    return +storageProjectId.split('_')[1];
};

export const logStorageSize = (keys?: string | string[]) => {
    if (browser.storage.sync.getBytesInUse) {
        browser.storage.sync
            .getBytesInUse(keys)
            .then(n => console.log('bytes in use', n));
    } else {
        console.warn('"browser.storage.sync.getBytesInUse" is not defined');
    }
};

export function clearStorage() {
    return browser.storage.sync.clear();
}

export function isSearchedProjectTab(
    item: SearchedProject | SearchedProjectTab
): item is SearchedProjectTab {
    return 'tabId' in item;
}

export function isSearchedOpenTabResult(
    result: SearchedOpenTabResult | SearchedProjectResult
): result is SearchedOpenTabResult {
    return 'windowId' in result;
}

export function isSearchedProjectResult(
    result: SearchedOpenTabResult | SearchedProjectResult
): result is SearchedProjectResult {
    return 'projectId' in result;
}
