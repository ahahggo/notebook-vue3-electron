module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  sourceType: 'unambiguous',
  plugins: [
      [
          "import",
        { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
      ]
  ]
}
