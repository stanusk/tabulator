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
    focused: boolean;
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

export type SelectedResult =
    | null
    | SearchedProjectResult
    | SearchedOpenTabResult;

export interface QuickActionSearchResults {
    projects: SearchedProjectResult[];
    openTabs: SearchedOpenTabResult[];
}

export type SearchedProjectResult = SearchedProject | SearchedProjectTab;

export interface SearchedProject {
    projectId: number;
}

export interface SearchedProjectTab extends SearchedProject {
    tabId: number;
}

export interface SearchedOpenTabResult {
    windowId: number;
    tabId: number;
}

export interface AggregatedSearchResults {
    projects: SearchedProjectAggregate[];
    windows: SearchedWindowAggregate[];
}

export interface SearchedProjectAggregate extends Project {
    hiddenTabsCount: number;
}

export interface SearchedWindowAggregate extends WindowClean {
    hiddenTabsCount: number;
}
