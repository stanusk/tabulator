import {
    Project,
    SearchedTabResult,
    SearchedProjectResult,
    SearchedProjectTab,
    SearchedWindowAggregate,
    TabClean,
    WindowClean,
    SearchedProjectAggregate,
} from '@/typings';
import { ensure, isSearchedProjectTab } from '@/store/helpers/helpers';
import { cloneDeep } from 'lodash-es';

export const findProjects = (searchPhrase: string, projects: Project[]) => {
    return projects.reduce((result, project) => {
        const projectByName =
            project.name.indexOf(searchPhrase) > -1
                ? [{ projectId: project.id }]
                : [];
        const projectTabs = findProjectTabs(searchPhrase, project);
        return [...result, ...projectByName, ...projectTabs];
    }, [] as SearchedProjectResult[]);
};

export const findOpenTabs = (searchPhrase: string, windows: WindowClean[]) => {
    return windows.reduce((result, window) => {
        return [...result, ...findWindowTabs(searchPhrase, window)];
    }, [] as SearchedTabResult[]);
};

const findProjectTabs = (searchPhrase: string, project: Project) => {
    const projectTabs = project.windows.map(win => win.tabs).flat();

    return projectTabs.reduce((result, tab) => {
        return [
            ...result,
            ...(tabSearchableTextContains(searchPhrase, tab)
                ? [
                      {
                          projectId: project.id,
                          tabId: tab.id,
                          windowId: tab.windowId,
                      },
                  ]
                : []),
        ];
    }, [] as SearchedProjectTab[]);
};

const findWindowTabs = (searchPhrase: string, window: WindowClean) => {
    return window.tabs.reduce((result, tab) => {
        return [
            ...result,
            ...(tabSearchableTextContains(searchPhrase, tab)
                ? [
                      {
                          windowId: window.id,
                          tabId: tab.id,
                      },
                  ]
                : []),
        ];
    }, [] as SearchedTabResult[]);
};

const tabSearchableTextContains = (searchPhrase: string, tab: TabClean) => {
    return `${tab.title}${tab.url}`.toLowerCase().indexOf(searchPhrase) > -1;
};

export function getProjectsWithWindowsWithSearchedTabs(
    allProjects: Project[],
    searchResultProjects: SearchedProjectResult[]
) {
    const projects = [] as SearchedProjectAggregate[];

    for (const currentProject of allProjects) {
        const searchResultsMatchingProject = [...searchResultProjects].filter(
            projectResult => projectResult.projectId === currentProject.id
        );

        if (searchResultsMatchingProject.length) {
            const searchResultsTabs = [
                ...searchResultsMatchingProject,
            ].filter(projectResult =>
                isSearchedProjectTab(projectResult)
            ) as SearchedProjectTab[];

            const windowsWithSearchedTabs = getWindowsWithSearchedTabs(
                currentProject.windows,
                searchResultsTabs
            );

            const projectWithWindowsWithSearchedTabs = {
                ...cloneDeep(currentProject),
                windows: windowsWithSearchedTabs,
                hiddenWindowsCount:
                    currentProject.windows.length -
                    windowsWithSearchedTabs.length,
                hiddenTabsCount:
                    countWindowsTabs(currentProject.windows) -
                    countWindowsTabs(windowsWithSearchedTabs),
            };
            projects.push(projectWithWindowsWithSearchedTabs);
        }
    }

    return projects;
}

export function getWindowsWithSearchedTabs(
    allWindows: WindowClean[],
    searchResultTabs: SearchedTabResult[]
) {
    const searchResultWindows = [] as SearchedWindowAggregate[];

    for (const searchResultTab of searchResultTabs) {
        const windowOfSearchResultTab = ensure(
            allWindows.find(win => win.id === searchResultTab.windowId),
            `AGGREGATED_SEARCH_RESULTS failed: window ${searchResultTab.windowId} not found!`
        );

        const searchedTab = ensure(
            windowOfSearchResultTab.tabs.find(
                tab => tab.id === searchResultTab.tabId
            ),
            `AGGREGATED_SEARCH_RESULTS failed: tab ${searchResultTab.tabId} not found!`
        );

        const windowInResults = searchResultWindows.find(
            win => win.id === searchedTab.windowId
        );

        if (windowInResults) {
            windowInResults.tabs.push(searchedTab);
            windowInResults.hiddenTabsCount--;
        } else {
            const windowWithoutNonSearchedTabs = {
                ...windowOfSearchResultTab,
                tabs: [searchedTab],
                hiddenTabsCount: windowOfSearchResultTab.tabs.length - 1,
            };
            searchResultWindows.push(windowWithoutNonSearchedTabs);
        }
    }

    return searchResultWindows;
}

export function countWindowsTabs(
    windows: (WindowClean | SearchedWindowAggregate)[]
) {
    return windows.reduce((count, window) => count + window.tabs.length, 0);
}
