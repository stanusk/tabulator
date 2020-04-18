import { Project, ProjectsStorage, TabClean } from '@/typings';
import { has, startsWith } from 'lodash-es';

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
            id: makeProjectIdFromStorageProjectId(id),
            ...projectsStorage[id],
        };
    });
};

export const makeStorageProjectId = (projectId: number): string => {
    return 'p_' + projectId;
};

export const makeProjectIdFromStorageProjectId = (
    storageProjectId: string
): number => {
    // from 'p_123' turn into 123
    // todo: consider optimizing with regex
    return Number(storageProjectId.split('_')[1]);
};

export const getUrlsPerWindow = (tabs: TabClean[]) => {
    const urlsByWindowIdDict = tabs.reduce((urlsDict, tab) => {
        if (!has(urlsDict, tab.windowId)) {
            urlsDict[tab.windowId] = [tab.url];
        } else {
            urlsDict[tab.windowId] = [...urlsDict[tab.windowId], tab.url];
        }

        return urlsDict;
    }, {} as { [windowId: number]: string[] });

    return Object.values(urlsByWindowIdDict);
};

export const findTabByUrl = (
    windows: (browser.windows.Window | undefined)[],
    url: string
) => {
    let windowId: number | undefined = undefined;
    let tabId: number | undefined = undefined;

    windows.forEach(win => {
        if (!win) {
            return;
        }

        const targetTab = win.tabs?.find(tab => {
            // todo!!!!!!!: fix
            return (
                tab.url === url ||
                // @ts-ignore - only in chrome and not typed
                tab.pendingUrl === url
            );
        });
        if (targetTab) {
            tabId = targetTab.id;
            windowId = targetTab.windowId;
        }
    });

    return { windowId, tabId };
};
