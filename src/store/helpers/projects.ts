import { Project, ProjectsStorage, TabClean, WindowClean } from '@/typings';
import { has, startsWith } from 'lodash-es';
import { ensure } from '@/store/helpers/helpers';

export const packProjectForStorage = (project: Project): ProjectsStorage => {
    return {
        [makeStorageProjectId(project.id)]: {
            name: project.name,
            windows: project.windows,
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

export function getWindowsWithSelectedTabs(
    selectedTabs: TabClean[],
    browserWindows: WindowClean[]
) {
    const resultWindows = [] as WindowClean[];

    for (const selectedTab of selectedTabs) {
        const windowInResults = resultWindows.find(
            win => win.id === selectedTab.windowId
        );

        if (windowInResults) {
            windowInResults.tabs.push(selectedTab);
        } else {
            const windowOfSelectedTab = ensure(
                browserWindows.find(win => win.id === selectedTab.windowId),
                `selected tab could not be found in windows: ${JSON.stringify(
                    selectedTab,
                    null,
                    2
                )}`
            );

            windowOfSelectedTab.tabs = [selectedTab];

            resultWindows.push(windowOfSelectedTab);
        }
    }

    return resultWindows;
}

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
