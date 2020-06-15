// projects
export interface Project {
    id: number;
    name: string;
    windows: WindowClean[];
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

export type SelectedResult = null | SearchedProjectResult | SearchedTabResult;

export interface QuickActionSearchResults {
    projects: SearchedProjectResult[];
    openTabs: SearchedTabResult[];
}

export type SearchedProjectResult = SearchedProject | SearchedProjectTab;

export interface SearchedProject {
    projectId: number;
}

export interface SearchedTabResult {
    windowId: number;
    tabId: number;
}

export type SearchedProjectTab = SearchedProject & SearchedTabResult;

export interface AggregatedSearchResults {
    projects: SearchedProjectAggregate[];
    windows: SearchedWindowAggregate[];
}

export interface SearchedProjectAggregate extends Project {
    hiddenWindowsCount: number;
    hiddenTabsCount: number;
    windows: SearchedWindowAggregate[];
}

export interface SearchedWindowAggregate extends WindowClean {
    hiddenTabsCount: number;
}
