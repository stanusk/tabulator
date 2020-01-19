import Tab = browser.tabs.Tab;
import Window = browser.windows.Window;
import { Project, ProjectsStorage, TabClean, WindowClean } from '@/typings';
import { startsWith, uniqueId } from 'lodash-es';

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

export const packForStorage = (projects: Project[]): ProjectsStorage => {
    return projects.reduce<ProjectsStorage>((projectsStorage, project) => {
        return {
            ...projectsStorage,
            [uniqueId('proj_')]: project,
        };
    }, {});
};

export const unpackFromStorage = (
    projectsStorage: ProjectsStorage
): Project[] => {
    const ids = Object.keys(projectsStorage).filter(id =>
        startsWith(id, 'proj_')
    );

    return ids.map(id => projectsStorage[id]);
};

///////////////////////////////////////////////////////////////////////////////
////////// todo: remove or move ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const checkBytes = (keys?: string | string[]) => {
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
