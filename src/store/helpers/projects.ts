import { Project, ProjectsStorage } from '@/typings';
import { startsWith } from 'lodash-es';

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
