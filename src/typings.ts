import Tab = browser.tabs.Tab;

export interface Project {
    name: string;
    tabs: TabClean[];
}

export interface ProjectsStorage {
    [id: string]: Project;
}

export type TabClean = Required<
    Pick<Tab, 'id' | 'title' | 'url' | 'active' | 'windowId'>
>;

export interface WindowClean {
    id: number;
    tabs: TabClean[];
}
