import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  minify: true, // ✅ Minification activée
  terserOptions: {
    compress: {
      inline: 3, // ✅ Niveau d'inlining agressif
      passes: 3, // ✅ Plusieurs passes d'optimisation
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      unsafe_Function: true,
      unsafe_math: true,
      unsafe_methods: true,
      unsafe_proto: true,
      unsafe_regexp: true,
      unsafe_undefined: true,
    },
    mangle: {
      toplevel: true, // ✅ Renomme tout
    },
  },
  treeshake: true,
  splitting: false,
});
