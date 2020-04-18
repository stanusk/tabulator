module.exports = {
    presets: ['@vue/cli-plugin-babel/preset'],
    plugins: [
        '@babel/plugin-proposal-optional-chaining',
        [
            'transform-imports',
            {
                quasar: {
                    transform: 'quasar/dist/babel-transforms/imports.js',
                    preventFullImport: true,
                },
            },
        ],
    ],
};
