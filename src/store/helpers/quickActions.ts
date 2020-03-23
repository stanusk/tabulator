import {
    Project,
    SearchedOpenTabResult,
    SearchedProjectResult,
    SearchedProjectTab,
    TabClean,
    WindowClean,
} from '@/typings';

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
    }, [] as SearchedOpenTabResult[]);
};

const findProjectTabs = (searchPhrase: string, project: Project) => {
    return project.tabs.reduce((result, tab) => {
        return [
            ...result,
            ...(tabSearchableTextContains(searchPhrase, tab)
                ? [
                      {
                          projectId: project.id,
                          tabId: tab.id,
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
    }, [] as SearchedOpenTabResult[]);
};

const tabSearchableTextContains = (searchPhrase: string, tab: TabClean) => {
    return `${tab.title}${tab.url}`.toLowerCase().indexOf(searchPhrase) > -1;
};
