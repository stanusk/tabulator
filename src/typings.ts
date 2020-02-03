import Tab = browser.tabs.Tab;

export interface Project {
    id: number;
    name: string;
    tabs: TabClean[];
}

export interface ProjectsStorage {
    [storageProjectId: string]: Omit<Project, 'id'>;
}

export type TabClean = Required<
    Pick<Tab, 'id' | 'title' | 'url' | 'active' | 'windowId'>
>;

export interface WindowClean {
    id: number;
    tabs: TabClean[];
}

export interface TabSelectionModifiers {
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
}
