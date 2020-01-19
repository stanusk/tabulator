import Tab = browser.tabs.Tab;

export interface Project {
    id: string;
    name: string;
    tabs: TabClean[];
}

export interface ProjectsStorage {
    [id: string]: Omit<Project, 'id'>;
}

export type TabClean = Required<
    Pick<Tab, 'id' | 'title' | 'url' | 'active' | 'windowId'>
>;

export interface WindowClean {
    id: number;
    tabs: TabClean[];
}
