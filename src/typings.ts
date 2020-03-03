// projects
export interface Project {
    id: number;
    name: string;
    tabs: TabClean[];
}

export interface ProjectsStorage {
    [storageProjectId: string]: Omit<Project, 'id'>;
}

// windows and tabs
export interface WindowClean {
    id: number;
    tabs: TabClean[];
}

export type TabClean = Required<
    Pick<Tab, 'id' | 'title' | 'url' | 'active' | 'windowId'>
>;

import Tab = browser.tabs.Tab;

export interface TabSelectionModifiers {
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
}

// quickActions
export interface QuickActionSearchResults {
    projects: number[];
    projectTabs: SearchedProjectTab[];
    openTabs: SearchedOpenTab[];
}

export interface SearchedProjectTab {
    projectId: number;
    tabId: number;
}

export interface SearchedOpenTab {
    windowId: number;
    tabId: number;
}

export interface AggregatedSearchResults {
    projects: SearchedProject[];
    windows: SearchedWindow[];
}

export interface SearchedProject extends Project {
    hiddenTabsCount: number;
}

export interface SearchedWindow extends WindowClean {
    hiddenTabsCount: number;
}
