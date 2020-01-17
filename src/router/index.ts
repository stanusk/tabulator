import Vue from 'vue';
import VueRouter from 'vue-router';
import Tabs from '../views/Tabs.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'tabs',
        component: Tabs,
    },
    {
        path: '/projects',
        name: 'projects',
        // route level code-splitting
        // this generates a separate chunk (projects.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "projects" */ '../views/Projects.vue'),
    },
    { path: '*', redirect: '/' },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
