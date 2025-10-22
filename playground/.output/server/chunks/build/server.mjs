import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { hasInjectionContext, getCurrentInstance, defineComponent, createElementBlock, shallowRef, provide, cloneVNode, h, useSSRContext, createApp, ref, computed, watch, mergeProps, unref, withCtx, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, toRef, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, shallowReactive, reactive, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, nextTick, inject, defineAsyncComponent, getCurrentScope } from 'vue';
import { l as hasProtocol, m as isScriptProtocol, k as joinURL, w as withQuery, n as sanitizeStatusCode, o as getContext$1, $ as $fetch, p as createHooks, h as createError$1, q as isEqual, r as stringifyParsedURL, v as stringifyQuery, x as parseQuery, y as toRouteMatcher, z as createRouter, A as defu } from '../_/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderSlotInner, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx$1(id = appId) {
  return getContext$1(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.19.3";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    const unresolvedPluginsForThisPlugin = plugin.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.add(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin);
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx$1(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp$1(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx$1(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp$1(id) {
  const nuxtAppInstance = tryUseNuxtApp$1(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig$1(_event) {
  return useNuxtApp$1().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp$1()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp$1()._route);
  }
  return useNuxtApp$1()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp$1()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp$1();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig$1()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp$1().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp$1().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig$1()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  const route = fullPath && typeof fullPath === "object" ? fullPath : {};
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: route.params || {},
    name: void 0,
    matched: route.matched || [],
    redirectedFrom: void 0,
    meta: route.meta || {},
    href: fullPath
  };
}
const router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    (/* @__PURE__ */ useRuntimeConfig$1()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          const route2 = router.resolve(props.to);
          return props.custom ? slots.default?.({ href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!nuxtApp.ssrContext?.islandContext) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp$1().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol$1 = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol$1, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const plugin_QYbH7JgJe2A4uRsk6lXsyZ_ceaI1tbKYZcZM9TBjXMQ = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      persianCalendar: {
        version: "1.0.0"
      }
    }
  };
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  plugin_QYbH7JgJe2A4uRsk6lXsyZ_ceaI1tbKYZcZM9TBjXMQ
];
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const usePersianCalendar = () => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const options = config.public.persianCalendar;
  const today = ref([1403, 1, 1]);
  const selectedDay = ref([1403, 1, 1]);
  const todayHijri = ref([1445, 1, 1]);
  const todayGregorian = ref([2024, 1, 1]);
  const persianMonthNames = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند"
  ];
  const hijriMonthNames = [
    "محرم",
    "صفر",
    "ربیع الاول",
    "ربیع الثانی",
    "جمادی الاول",
    "جمادی الثانیه",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذیقعده",
    "ذیحجه"
  ];
  const gregorianMonthNames = [
    "ژانویه",
    "فوریه",
    "مارس",
    "آپریل",
    "می",
    "ژوئن",
    "جولای",
    "آگوست",
    "سپتامبر",
    "اکتبر",
    "نوامبر",
    "دسامبر"
  ];
  const dayNames = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
  const persianEvents = [
    { "date": [1, 1], "title": ["عید نوروز"], "is_holiday": true },
    { "date": [1, 2], "title": ["عید نوروز"], "is_holiday": true },
    { "date": [1, 3], "title": ["عید نوروز"], "is_holiday": true },
    { "date": [1, 4], "title": ["عید نوروز"], "is_holiday": true },
    { "date": [1, 6], "title": ["ولادت زرتشت"], "is_holiday": false },
    { "date": [1, 7], "title": ["روز هنرهای نمایشی"], "is_holiday": false },
    { "date": [1, 12], "title": ["روز جمهوری اسلامی"], "is_holiday": true },
    { "date": [1, 13], "title": ["روز طبیعت"], "is_holiday": true },
    { "date": [1, 18], "title": ["روز سلامتی"], "is_holiday": false },
    { "date": [1, 20], "title": ["روز ملی فناوری هسته‌ای"], "is_holiday": false },
    { "date": [1, 25], "title": ["روز بزرگداشت عطار نیشابوری"], "is_holiday": false },
    { "date": [1, 29], "title": ["روز ارتش جمهوری اسلامی و نیروی زمینی"], "is_holiday": false },
    { "date": [2, 1], "title": ["روز بزرگداشت سعدی"], "is_holiday": false },
    { "date": [2, 3], "title": ["روز بزرگداشت شیخ بهایی", "روز معماری"], "is_holiday": false },
    { "date": [2, 7], "title": ["روز ایمنی حمل و نقل"], "is_holiday": false },
    { "date": [2, 9], "title": ["روز شوراها"], "is_holiday": false },
    { "date": [2, 10], "title": ["روز ملی خلیج فارس"], "is_holiday": false },
    { "date": [2, 15], "title": ["روز بزرگداشت شیخ صدوق"], "is_holiday": false },
    { "date": [2, 18], "title": ["روز بیماری‌های خاص و صعب العلاج"], "is_holiday": false },
    { "date": [2, 19], "title": ["روز بزرگداشت شیخ کلینی"], "is_holiday": false },
    { "date": [2, 25], "title": ["روز پاسداشت زبان فارسی و بزرگداشت حکیم ابوالقاسم فردوسی"], "is_holiday": false },
    { "date": [2, 28], "title": ["روز بزرگداشت حکیم عمر خیام"], "is_holiday": false },
    { "date": [2, 30], "title": ["روز ملی جمعیت"], "is_holiday": false },
    { "date": [2, 31], "title": ["روز اهدای عضو", "اهدای زندگی"], "is_holiday": false },
    { "date": [3, 1], "title": ["روز بهره‌وری و بهینه‌سازی مصرف", "روز بزرگداشت ملاصدرا"], "is_holiday": false },
    { "date": [3, 8], "title": ["روز فرهنگ پهلوانی و ورزش زورخانه‌ای"], "is_holiday": false },
    { "date": [3, 14], "title": ["رحلت امام خمینی"], "is_holiday": true },
    { "date": [3, 15], "title": ["قیام خونین 15 خرداد"], "is_holiday": true },
    { "date": [3, 20], "title": ["روز صنایع دستی"], "is_holiday": false },
    { "date": [3, 29], "title": ["درگذشت دکتر علی شریعتی"], "is_holiday": false },
    { "date": [3, 31], "title": ["شهادت دکتر مصطفی چمران", "روز بسیج استادان"], "is_holiday": false },
    { "date": [4, 1], "title": ["روز اصناف"], "is_holiday": false },
    { "date": [4, 7], "title": ["روز قوه قضاییه"], "is_holiday": false },
    { "date": [4, 8], "title": ["روز مبارزه با سلاح‌های شیمیایی و میکروبی"], "is_holiday": false },
    { "date": [4, 10], "title": ["روز صنعت و معدن"], "is_holiday": false },
    { "date": [4, 14], "title": ["روز قلم"], "is_holiday": false },
    { "date": [4, 18], "title": ["روز ادبیات کودکان و نوجوانان"], "is_holiday": false },
    { "date": [4, 23], "title": ["روز گفت‌وگو و تعامل سازنده با جهان"], "is_holiday": false },
    { "date": [4, 25], "title": ["روز بهزیستی و تامین اجتماعی"], "is_holiday": false },
    { "date": [5, 9], "title": ["روز اهدای خون"], "is_holiday": false },
    { "date": [5, 14], "title": ["روز خانواده و تکریم بازنشستگان"], "is_holiday": false },
    { "date": [5, 17], "title": ["روز خبرنگار"], "is_holiday": false },
    { "date": [5, 21], "title": ["روز حمایت از صنایع کوچک"], "is_holiday": false },
    { "date": [5, 22], "title": ["روز تشکل‌ها و مشارکت‌های اجتماعی"], "is_holiday": false },
    { "date": [5, 23], "title": ["روز مقاومت اسلامی"], "is_holiday": false },
    { "date": [5, 29], "title": ["روز تجلیل از اسرا و مفقودان"], "is_holiday": false },
    { "date": [5, 30], "title": ["روز بزرگداشت علامه مجلسی", "روز جهانی مسجد"], "is_holiday": false },
    { "date": [6, 1], "title": ["روز بزرگداشت ابوعلی سینا", "روز پزشک"], "is_holiday": false },
    { "date": [6, 4], "title": ["روز کارمند"], "is_holiday": false },
    { "date": [6, 5], "title": ["روز بزرگداشت محمدبن‌زکریا رازی", "روز داروسازی", "روز کشتی"], "is_holiday": false },
    { "date": [6, 8], "title": ["روز مبارزه با تروریسم"], "is_holiday": false },
    { "date": [6, 13], "title": ["روز بزرگداشت ابوریحان بیرونی", "روز تعاون"], "is_holiday": false },
    { "date": [6, 21], "title": ["روز سینما"], "is_holiday": false },
    { "date": [6, 23], "title": ["روز بزرگداشت سلمان فارسی"], "is_holiday": false },
    { "date": [6, 27], "title": ["روز بزرگداشت شهریار", "روز شعر و ادب فارسی"], "is_holiday": false },
    { "date": [7, 5], "title": ["روز گردشگری"], "is_holiday": false },
    { "date": [7, 7], "title": ["روز آتش‌نشانی و امنیت", "روز بزرگداشت شمس"], "is_holiday": false },
    { "date": [7, 8], "title": ["روز بزرگداشت مولوی"], "is_holiday": false },
    { "date": [7, 12], "title": ["روز وقف"], "is_holiday": false },
    { "date": [7, 13], "title": ["روز نیروی انتظامی"], "is_holiday": false },
    { "date": [7, 14], "title": ["روز دامپزشکی"], "is_holiday": false },
    { "date": [7, 15], "title": ["روز روستا و عشایر"], "is_holiday": false },
    { "date": [7, 20], "title": ["روز بزرگداشت حافظ"], "is_holiday": false },
    { "date": [7, 24], "title": ["روز ملی پارالمپیک"], "is_holiday": false },
    { "date": [7, 26], "title": ["روز تربیت بدنی و ورزش"], "is_holiday": false },
    { "date": [7, 29], "title": ["روز صادرات"], "is_holiday": false },
    { "date": [8, 8], "title": ["روز نوجوان و بسیج دانشجویی"], "is_holiday": false },
    { "date": [8, 13], "title": ["روز دانش‌آموز"], "is_holiday": false },
    { "date": [8, 14], "title": ["روز فرهنگ عمومی"], "is_holiday": false },
    { "date": [8, 24], "title": ["روز کتاب", "کتاب‌خوانی و کتابدار"], "is_holiday": false },
    { "date": [9, 7], "title": ["روز نیروی دریایی"], "is_holiday": false },
    { "date": [9, 9], "title": ["روز بزرگداشت شیخ مفید"], "is_holiday": false },
    { "date": [9, 16], "title": ["روز دانشجو"], "is_holiday": false },
    { "date": [9, 25], "title": ["روز پژوهش"], "is_holiday": false },
    { "date": [9, 27], "title": ["روز وحدت حوزه و دانشگاه"], "is_holiday": false },
    { "date": [9, 30], "title": ["شب یلدا"], "is_holiday": false },
    { "date": [10, 5], "title": ["روز ایمنی در برابر زلزله و کاهش اثرات بلایای طبیعی"], "is_holiday": false },
    { "date": [11, 14], "title": ["روز فناوری فضایی"], "is_holiday": false },
    { "date": [11, 19], "title": ["روز نیروی هوایی"], "is_holiday": false },
    { "date": [11, 22], "title": ["پیروزی انقلاب اسلامی"], "is_holiday": true },
    { "date": [11, 19], "title": ["روز اقتصاد مقاومتی و کارآفرینی"], "is_holiday": false },
    { "date": [12, 5], "title": ["روز بزرگداشت خواجه نصیرالدین طوسی", "روز مهندسی"], "is_holiday": false },
    { "date": [12, 14], "title": ["روز احسان و نیکوکاری", "روز ترویج فرهنگ قرض‌الحسنه"], "is_holiday": false },
    { "date": [12, 15], "title": ["روز درختکاری"], "is_holiday": false },
    { "date": [12, 20], "title": ["روز راهیان نور"], "is_holiday": false },
    { "date": [12, 21], "title": ["روز بزرگداشت نظامی گنجوی"], "is_holiday": false },
    { "date": [12, 25], "title": ["روز بزرگداشت پروین اعتصامی"], "is_holiday": false },
    { "date": [12, 29], "title": ["روز ملی شدن صنعت نفت"], "is_holiday": true }
  ];
  const unofficialWorldEvents = [
    { "date": [1, 1], "title": ["آغاز سال جدید هجری قمری"], "is_holiday": false },
    { "date": [1, 9], "title": ["تاسوعای حسینی"], "is_holiday": true },
    { "date": [1, 10], "title": ["عاشورای حسینی"], "is_holiday": true },
    { "date": [1, 12], "title": ["شهادت امام سجاد (ع)"], "is_holiday": false },
    { "date": [2, 20], "title": ["اربعین حسینی"], "is_holiday": true },
    { "date": [2, 28], "title": ["رحلت حضرت رسول اکرم (ص)", "شهادت امام حسن مجتبی (ع)"], "is_holiday": true },
    { "date": [2, 30], "title": ["شهادت امام رضا (ع)"], "is_holiday": true },
    { "date": [3, 1], "title": ["هجرت حضرت رسول اکرم (ص) از مکه به مدینه"], "is_holiday": false },
    { "date": [3, 8], "title": ["شهادت امام حسن عسکری (ع)"], "is_holiday": true },
    { "date": [3, 17], "title": ["ولادت حضرت رسول اکرم (ص)"], "is_holiday": true },
    { "date": [3, 19], "title": ["ولادت حضرت رسول اکرم (ص) به روایت اهل سنت"], "is_holiday": false },
    { "date": [4, 8], "title": ["ولادت امام حسن عسکری (ع)"], "is_holiday": false },
    { "date": [4, 10], "title": ["وفات حضرت معصومه (س)"], "is_holiday": false },
    { "date": [5, 5], "title": ["ولادت حضرت زینب (س)"], "is_holiday": false },
    { "date": [6, 3], "title": ["شهادت حضرت فاطمه (س)"], "is_holiday": true },
    { "date": [6, 13], "title": ["وفات حضرت ام‌البنین (س)"], "is_holiday": false },
    { "date": [6, 20], "title": ["ولادت حضرت فاطمه (س) و روز زن"], "is_holiday": false },
    { "date": [7, 1], "title": ["ولادت امام محمد باقر (ع)"], "is_holiday": false },
    { "date": [7, 3], "title": ["شهادت امام علی نقی (ع)"], "is_holiday": false },
    { "date": [7, 10], "title": ["ولادت امام محمد تقی (ع)"], "is_holiday": false },
    { "date": [7, 13], "title": ["ولادت امام علی (ع)"], "is_holiday": true },
    { "date": [7, 15], "title": ["ارتحال حضرت زینب (س)"], "is_holiday": false },
    { "date": [7, 25], "title": ["شهادت امام موسی کاظم (ع)"], "is_holiday": false },
    { "date": [7, 27], "title": ["مبعث حضرت رسول اکرم (ص)"], "is_holiday": true },
    { "date": [8, 3], "title": ["ولادت امام حسین (ع)"], "is_holiday": false },
    { "date": [8, 4], "title": ["ولادت ابوالفضل عباس (ع)"], "is_holiday": false },
    { "date": [8, 5], "title": ["ولادت امام سجاد (ع)"], "is_holiday": false },
    { "date": [8, 11], "title": ["ولادت علی اکبر (ع)"], "is_holiday": false },
    { "date": [8, 15], "title": ["ولادت حضرت قائم (عجل)"], "is_holiday": true },
    { "date": [9, 15], "title": ["ولادت امام حسن مجتبی (ع)"], "is_holiday": false },
    { "date": [9, 18], "title": ["شب قدر"], "is_holiday": false },
    { "date": [9, 19], "title": ["ضربت خوردن امام علی (ع)"], "is_holiday": false },
    { "date": [9, 20], "title": ["شب قدر"], "is_holiday": false },
    { "date": [9, 21], "title": ["شهادت حضرت علی (ع)"], "is_holiday": true },
    { "date": [9, 22], "title": ["شب قدر"], "is_holiday": false },
    { "date": [10, 1], "title": ["عید فطر"], "is_holiday": true },
    { "date": [10, 2], "title": ["تعطیلات عید فطر"], "is_holiday": true },
    { "date": [10, 25], "title": ["شهادت امام جعفر صادق (ع)"], "is_holiday": true },
    { "date": [11, 1], "title": ["ولادت حضرت معصومه (س)"], "is_holiday": false },
    { "date": [11, 11], "title": ["ولادت امام رضا (ع)"], "is_holiday": false },
    { "date": [11, 30], "title": ["شهادت امام محمد تقی (ع)"], "is_holiday": false },
    { "date": [12, 1], "title": ["سالروز ازدواج امام علی (ع) و حضرت فاطمه (س)"], "is_holiday": false },
    { "date": [12, 7], "title": ["شهادت امام محمد باقر (ع)"], "is_holiday": false },
    { "date": [12, 9], "title": ["روز عرفه"], "is_holiday": false },
    { "date": [12, 10], "title": ["عید قربان"], "is_holiday": true },
    { "date": [12, 15], "title": ["ولادت امام علی نقی (ع)"], "is_holiday": false },
    { "date": [12, 18], "title": ["عید غدیر خم"], "is_holiday": true },
    { "date": [12, 20], "title": ["ولادت امام موسی کاظم (ع)"], "is_holiday": false }
  ];
  const officialWorldEvents = [
    { "date": [1, 1], "title": ["جشن آغاز سال نو میلادی"], "is_holiday": false },
    { "date": [1, 14], "title": ["روز جهانی منطق"], "is_holiday": false },
    { "date": [1, 24], "title": ["روز جهانی آموزش", "روز جهانی فرهنگ آفریقایی"], "is_holiday": false },
    { "date": [1, 26], "title": ["روز جهانی گمرک"], "is_holiday": false },
    { "date": [1, 27], "title": ["روز جهانی یادبود هولوکاست"], "is_holiday": false },
    { "date": [2, 11], "title": ["روز جهانی زنان و دختران در علم"], "is_holiday": false },
    { "date": [2, 13], "title": ["روز جهانی رادیو"], "is_holiday": false },
    { "date": [2, 14], "title": ["جشن ولنتاین"], "is_holiday": false },
    { "date": [2, 20], "title": ["روز جهانی عدالت اجتماعی"], "is_holiday": false },
    { "date": [2, 21], "title": ["روز جهانی زبان مادری"], "is_holiday": false },
    { "date": [3, 4], "title": ["روز جهانی مهندسی برای توسعه پایدار"], "is_holiday": false },
    { "date": [3, 8], "title": ["روز جهانی زن"], "is_holiday": false },
    { "date": [3, 14], "title": ["روز جهانی ریاضیات"], "is_holiday": false },
    { "date": [3, 20], "title": ["روز جهانی شادی", "روز جهانی فرانکفونی"], "is_holiday": false },
    { "date": [3, 21], "title": ["روز جهانی نوروز", "روز جهانی شعر", "روز جهانی رفع تبعیض نژادی"], "is_holiday": false },
    { "date": [3, 22], "title": ["روز جهانی آب"], "is_holiday": false },
    { "date": [3, 23], "title": ["روز جهانی هواشناسی"], "is_holiday": false },
    { "date": [3, 27], "title": ["روز جهانی تئاتر"], "is_holiday": false },
    { "date": [4, 4], "title": ["روز جهانی ضد مین"], "is_holiday": false },
    { "date": [4, 6], "title": ["روز جهانی ورزش برای توسعه و صلح"], "is_holiday": false },
    { "date": [4, 7], "title": ["روز جهانی بهداشت"], "is_holiday": false },
    { "date": [4, 12], "title": ["روز جهانی کیهان نوردی"], "is_holiday": false },
    { "date": [4, 15], "title": ["روز جهانی هنر"], "is_holiday": false },
    { "date": [4, 22], "title": ["روز زمین"], "is_holiday": false },
    { "date": [4, 23], "title": ["روز جهانی کتاب"], "is_holiday": false },
    { "date": [4, 27], "title": ["روز جهانی طراحی و گرافیک"], "is_holiday": false },
    { "date": [4, 30], "title": ["روز جهانی جاز"], "is_holiday": false },
    { "date": [5, 1], "title": ["روز جهانی کارگر"], "is_holiday": false },
    { "date": [5, 3], "title": ["روز جهانی آزادی مطبوعات"], "is_holiday": false },
    { "date": [5, 5], "title": ["روز جهانی ماما", "روز میراث جهانی آفریقا", "روز جهانی زبان پرتغالی"], "is_holiday": false },
    { "date": [5, 8], "title": ["روز جهانی صلیب سرخ و هلال احمر"], "is_holiday": false },
    { "date": [5, 15], "title": ["روز جهانی خانواده"], "is_holiday": false },
    { "date": [5, 16], "title": ["روز جهانی نور", "روز جهانی زندگی با هم در صلح"], "is_holiday": false },
    { "date": [5, 17], "title": ["روز جهانی ارتباطات"], "is_holiday": false },
    { "date": [5, 18], "title": ["روز جهانی موزه و میراث فرهنگی"], "is_holiday": false },
    { "date": [5, 21], "title": ["روز جهانی تنوع فرهنگی برای گفتگو و توسعه"], "is_holiday": false },
    { "date": [5, 22], "title": ["روز جهانی تنوع زیستی"], "is_holiday": false },
    { "date": [5, 29], "title": ["روز جهانی کلاه‌آبی‌های سازمان ملل"], "is_holiday": false },
    { "date": [5, 31], "title": ["روز جهانی بدون دخانیات"], "is_holiday": false },
    { "date": [6, 4], "title": ["روز جهانی کودکان قربانی تجاوز"], "is_holiday": false },
    { "date": [6, 5], "title": ["روز جهانی محیط زیست"], "is_holiday": false },
    { "date": [6, 8], "title": ["روز جهانی اقیانوس‌ها"], "is_holiday": false },
    { "date": [6, 10], "title": ["روز جهانی صنایع دستی"], "is_holiday": false },
    { "date": [6, 12], "title": ["روز جهانی مبارزه با کار کودکان"], "is_holiday": false },
    { "date": [6, 14], "title": ["روز جهانی اهدای خون"], "is_holiday": false },
    { "date": [6, 17], "title": ["روز جهانی مبارزه با بیابان و خشکسالی"], "is_holiday": false },
    { "date": [6, 20], "title": ["روز جهانی پناهندگان"], "is_holiday": false },
    { "date": [6, 23], "title": ["روز جهانی خدمات دولتی"], "is_holiday": false },
    { "date": [6, 26], "title": ["روز جهانی مبارزه با مواد مخدر"], "is_holiday": false },
    { "date": [7, 11], "title": ["روز جهانی جمعیت"], "is_holiday": false },
    { "date": [7, 18], "title": ["روز جهانی نلسون ماندلا"], "is_holiday": false },
    { "date": [7, 26], "title": ["روز جهانی حفاظت از اکوسیستم حرا"], "is_holiday": false },
    { "date": [8, 1], "title": ["روز جهانی شیر مادر"], "is_holiday": false },
    { "date": [8, 9], "title": ["روز جهانی بومیان"], "is_holiday": false },
    { "date": [8, 12], "title": ["روز جهانی جوانان"], "is_holiday": false },
    { "date": [8, 13], "title": ["روز جهانی چپ‌دست‌ها"], "is_holiday": false },
    { "date": [8, 19], "title": ["روز جهانی عکاسی"], "is_holiday": false },
    { "date": [8, 23], "title": ["روز جهانی یادآوری تجارت برده و لغو آن"], "is_holiday": false },
    { "date": [8, 31], "title": ["روز جهانی وبلاگ"], "is_holiday": false },
    { "date": [9, 8], "title": ["روز جهانی سوادآموزی"], "is_holiday": false },
    { "date": [9, 10], "title": ["روز جهانی پیشگیری از خودکشی"], "is_holiday": false },
    { "date": [9, 15], "title": ["روز جهانی مردم سالاری"], "is_holiday": false },
    { "date": [9, 16], "title": ["روز جهانی نگه‌داری از لایه ازن"], "is_holiday": false },
    { "date": [9, 20], "title": ["روز جهانی ورزش دانشگاهی"], "is_holiday": false },
    { "date": [9, 21], "title": ["روز جهانی صلح"], "is_holiday": false },
    { "date": [9, 27], "title": ["روز جهانی جهان‌گردی"], "is_holiday": false },
    { "date": [9, 28], "title": ["روز جهانی دسترسی جهانی به اطلاعات"], "is_holiday": false },
    { "date": [9, 30], "title": ["روز جهانی دریانوردی", "روز جهانی ناشنوایان", "روز جهانی ترجمه و مترجم"], "is_holiday": false },
    { "date": [10, 1], "title": ["روز جهانی سالمندان"], "is_holiday": false },
    { "date": [10, 4], "title": ["آغاز هفته جهانی فضا"], "is_holiday": false },
    { "date": [10, 5], "title": ["روز جهانی آموزگار"], "is_holiday": false },
    { "date": [10, 8], "title": ["روز جهانی کودک"], "is_holiday": false },
    { "date": [10, 9], "title": ["روز جهانی پست"], "is_holiday": false },
    { "date": [10, 10], "title": ["روز جهانی بهداشت روان", "روز جهانی مبارزه با حکم اعدام"], "is_holiday": false },
    { "date": [10, 11], "title": ["روز جهانی دختر"], "is_holiday": false },
    { "date": [10, 13], "title": ["روز جهانی کاهش بلایا"], "is_holiday": false },
    { "date": [10, 14], "title": ["روز جهانی استاندارد"], "is_holiday": false },
    { "date": [10, 15], "title": ["روز جهانی عصای سفید"], "is_holiday": false },
    { "date": [10, 16], "title": ["روز جهانی غذا"], "is_holiday": false },
    { "date": [10, 17], "title": ["روز جهانی مبارزه با فقر"], "is_holiday": false },
    { "date": [10, 24], "title": ["روز جهانی سازمان ملل", "روز جهانی اخبار"], "is_holiday": false },
    { "date": [10, 27], "title": ["روز جهانی میراث سمعی و بصری"], "is_holiday": false },
    { "date": [11, 2], "title": ["روز جهانی پایان دادن به مصونیت از مجازات برای جنایات علیه خبرنگاران"], "is_holiday": false },
    { "date": [11, 5], "title": ["روز جهانی زبان رومی", "روز جهانی آگاهی از سونامی"], "is_holiday": false },
    { "date": [11, 10], "title": ["روز جهانی علم در خدمت صلح و توسعه پایدار"], "is_holiday": false },
    { "date": [11, 14], "title": ["روز جهانی دیابت", "روز جهانی مبارزه با قاچاق غیرقانونی اموال فرهنگی"], "is_holiday": false },
    { "date": [11, 16], "title": ["روز جهانی مدارا"], "is_holiday": false },
    { "date": [11, 18], "title": ["روز جهانی هنر اسلامی", "روز جهانی فلسفه"], "is_holiday": false },
    { "date": [11, 19], "title": ["روز جهانی آقایان"], "is_holiday": false },
    { "date": [11, 21], "title": ["روز جهانی تلویزیون"], "is_holiday": false },
    { "date": [11, 25], "title": ["روز جهانی مبارزه با خشونت علیه زنان"], "is_holiday": false },
    { "date": [11, 26], "title": ["روز جهانی درخت زیتون"], "is_holiday": false },
    { "date": [11, 29], "title": ["روز جهانی همبستگی با مردم فلسطین"], "is_holiday": false },
    { "date": [12, 1], "title": ["روز جهانی ایدز"], "is_holiday": false },
    { "date": [12, 2], "title": ["روز جهانی آزادی بردگان"], "is_holiday": false },
    { "date": [12, 3], "title": ["روز جهانی افراد دارای معلولیت"], "is_holiday": false },
    { "date": [12, 7], "title": ["روز جهانی هواپیمایی"], "is_holiday": false },
    { "date": [12, 10], "title": ["روز جهانی حقوق بشر"], "is_holiday": false },
    { "date": [12, 11], "title": ["روز جهانی کوه‌نوردی"], "is_holiday": false },
    { "date": [12, 18], "title": ["روز جهانی مهاجرین", "روز جهانی زبان عربی"], "is_holiday": false },
    { "date": [12, 25], "title": ["جشن کریسمس"], "is_holiday": false },
    { "date": [12, 30], "title": ["روز جهانی همبستگی انسانی"], "is_holiday": false }
  ];
  const hijriEvents = [
    { "date": [7, 1], "title": ["روز جهانی بال مرغ"], "is_holiday": false },
    { "date": [7, 3], "title": ["روز جهانی بدون کیسه پلاستیکی"], "is_holiday": false },
    { "date": [7, 6], "title": ["روز جهانی بوسیدن"], "is_holiday": false },
    { "date": [7, 7], "title": ["روز جهانی شکلات"], "is_holiday": false },
    { "date": [7, 13], "title": ["روز جهانی سنگ"], "is_holiday": false },
    { "date": [7, 20], "title": ["روز جهانی پرش"], "is_holiday": false },
    { "date": [7, 28], "title": ["روز جهانی هپاتیت"], "is_holiday": false },
    { "date": [7, 30], "title": ["روز جهانی دوستی"], "is_holiday": false },
    { "date": [8, 4], "title": ["روز جهانی پلنگ ابری"], "is_holiday": false },
    { "date": [8, 12], "title": ["روز جهانی فیل"], "is_holiday": false },
    { "date": [8, 19], "title": ["روز جهانی زنبور عسل"], "is_holiday": false },
    { "date": [8, 20], "title": ["روز جهانی پشه"], "is_holiday": false },
    { "date": [9, 2], "title": ["روز جهانی ریش", "روز جهانی نارگیل"], "is_holiday": false },
    { "date": [9, 9], "title": ["روز جهانی سودوکو"], "is_holiday": false },
    { "date": [9, 13], "title": ["روز جهانی برنامه‌نویسان"], "is_holiday": false },
    { "date": [9, 17], "title": ["روز جهانی موسیقی کانتری"], "is_holiday": false },
    { "date": [9, 21], "title": ["روز جهانی قدردانی"], "is_holiday": false },
    { "date": [9, 23], "title": ["روز جهانی زبان اشاره"], "is_holiday": false },
    { "date": [9, 24], "title": ["روز جهانی بالیوود", "روز جهانی رودخانه‌ها"], "is_holiday": false },
    { "date": [9, 29], "title": ["روز جهانی نجوم"], "is_holiday": false },
    { "date": [9, 30], "title": ["روز جهانی لباس توری"], "is_holiday": false }
  ];
  const hijriMonthsDays = {
    start_julian_day: 2192399,
    end_julian_day: 2195868,
    days: {
      1427: [355, 30, 29, 29, 30, 29, 30, 30, 30, 30, 29, 29, 30],
      1428: [354, 29, 30, 29, 29, 29, 30, 30, 29, 30, 30, 30, 29],
      1429: [354, 30, 29, 30, 29, 29, 29, 30, 30, 29, 30, 30, 29],
      1430: [354, 30, 30, 29, 29, 30, 29, 30, 29, 29, 30, 30, 29],
      1431: [354, 30, 30, 29, 30, 29, 30, 29, 30, 29, 29, 30, 29],
      1432: [355, 30, 30, 29, 30, 30, 30, 29, 29, 30, 29, 30, 29],
      1433: [355, 29, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 30],
      1434: [354, 29, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],
      1435: [355, 29, 30, 29, 30, 29, 30, 29, 30, 30, 30, 29, 30],
      1436: [354, 29, 30, 29, 29, 30, 29, 30, 29, 30, 29, 30, 30],
      1437: [354, 29, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30, 30],
      1438: [354, 29, 30, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30],
      1439: [354, 29, 30, 30, 30, 30, 29, 30, 29, 29, 30, 29, 29],
      1440: [355, 30, 29, 30, 30, 30, 29, 30, 30, 29, 29, 30, 29],
      1441: [355, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30],
      1442: [354, 29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29],
      1443: [354, 29, 30, 30, 29, 29, 30, 29, 30, 30, 29, 30, 29],
      1444: [354, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 29],
      1445: [354, 30, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 29],
      1446: [355, 30, 30, 30, 29, 30, 30, 29, 30, 29, 29, 30, 29],
      1447: [355, 29, 30, 29, 30, 30, 30, 29, 30, 30, 29, 29, 30],
      1448: [354, 29, 29, 30, 29, 30, 30, 29, 30, 30, 30, 29, 29],
      1449: [355, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30, 29, 30],
      1450: [354, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30, 29],
      1451: [354, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 29],
      1452: [354, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 29],
      1453: [355, 30, 30, 29, 30, 29, 30, 30, 29, 29, 30, 29, 30],
      1454: [354, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 29],
      1455: [355, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29],
      1456: [355, 29, 30, 29, 29, 30, 29, 30, 30, 29, 30, 30, 30],
      1457: [354, 29, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30],
      1458: [354, 30, 29, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30],
      1459: [354, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30],
      1460: [354, 30, 29, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29],
      1461: [355, 30, 29, 30, 30, 29, 30, 30, 29, 29, 30, 29, 30],
      1462: [354, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29],
      1463: [355, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30],
      1464: [354, 30, 29, 29, 30, 29, 29, 30, 29, 30, 30, 29, 30]
    }
  };
  const dayCountInMonth = (year, month) => {
    month = month - 1;
    if (month < 0)
      return -1;
    if (month < 6)
      return 31;
    if (month < 11)
      return 30;
    const ary = [1, 5, 9, 13, 17, 22, 26, 30];
    const index = year % 33;
    for (let i = 0; i < ary.length; i++) {
      if (index === ary[i])
        return 30;
    }
    return 29;
  };
  const getDayEvents = (year, month, day) => {
    const events = {
      persianEvents: [],
      hijriEvents: [],
      officialWorldEvents: [],
      unofficialWorldEvents: []
    };
    if (options.persianEvent !== false) {
      const pe = persianEvents.find((item) => item.date[0] === month && item.date[1] === day);
      if (pe)
        events.persianEvents = pe.title;
    }
    if (options.hijriEvent !== false) {
      const hijriDate = jalaliToHijri(year, month, day);
      const he = hijriEvents.find((item) => item.date[0] === hijriDate[1] && item.date[1] === hijriDate[2]);
      if (he)
        events.hijriEvents = he.title;
    }
    if (options.officialWorldEvent !== false) {
      const gregorianDate = jalaliToGregorian(year, month, day);
      const owe = officialWorldEvents.find((item) => item.date[0] === gregorianDate[1] && item.date[1] === gregorianDate[2]);
      if (owe)
        events.officialWorldEvents = owe.title;
    }
    if (options.unofficialWorldEvent !== false) {
      const gregorianDate = jalaliToGregorian(year, month, day);
      const uwe = unofficialWorldEvents.find((item) => item.date[0] === gregorianDate[1] && item.date[1] === gregorianDate[2]);
      if (uwe)
        events.unofficialWorldEvents = uwe.title;
    }
    return events;
  };
  const jalaliToGregorian = (year, month, day) => {
    let gYear = year <= 979 ? 621 : 1600;
    year -= year <= 979 ? 0 : 979;
    let days = 365 * year + Math.floor(year / 33) * 8 + Math.floor((Math.floor(year % 33) + 3) / 4) + 78 + day + (month < 7 ? (month - 1) * 31 : (month - 7) * 30 + 186);
    gYear += 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) {
      gYear += 100 * Math.floor(--days / 36524);
      days %= 36524;
      if (days >= 365)
        days++;
    }
    gYear += 4 * Math.floor(days / 1461);
    days %= 1461;
    gYear += Math.floor((days - 1) / 365);
    if (days > 365)
      days = (days - 1) % 365;
    let gDay = days + 1;
    const dayCheck = [0, 31, gYear % 4 === 0 && gYear % 100 !== 0 || gYear % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gMonth;
    for (gMonth = 0; gMonth < 13; gMonth++) {
      const dCount = dayCheck[gMonth];
      if (gDay <= dCount)
        break;
      gDay -= dCount;
    }
    return [gYear, gMonth, gDay];
  };
  const jalaliToHijri = (year, month, day) => {
    year += 1595;
    const julianDay = 1365392 + 365 * year + Math.floor(year / 33) * 8 + Math.floor((Math.floor(year % 33) + 3) / 4) + day + (month < 7 ? (month - 1) * 31 : (month - 7) * 30 + 186) - 0.5;
    let hijriYear = Math.floor((30 * (julianDay - 19484395e-1) + 10646) / 10631);
    let temp = julianDay - (19484395e-1 + (hijriYear - 1) * 354 + Math.floor((3 + 11 * hijriYear) / 30));
    hijriYear -= 990;
    if (julianDay >= hijriMonthsDays.start_julian_day && julianDay <= hijriMonthsDays.end_julian_day) {
      let hijriDay2 = Math.floor(julianDay - hijriMonthsDays.start_julian_day + 1);
      for (let y in hijriMonthsDays.days) {
        const yearData = hijriMonthsDays.days[y];
        if (hijriDay2 > yearData[0]) {
          hijriDay2 -= yearData[0];
        } else {
          let hijriMonth2 = 1;
          while (hijriMonth2 < 13 && hijriDay2 > yearData[hijriMonth2]) {
            hijriDay2 -= yearData[hijriMonth2];
            hijriMonth2++;
          }
          return [parseInt(y), hijriMonth2, hijriDay2];
        }
      }
    }
    let hijriMonth = Math.floor((temp - 29) / 29.5 + 1.99);
    if (hijriMonth > 12) hijriMonth = 12;
    const hijriDay = Math.floor(1 + temp - Math.floor(29.5 * (hijriMonth - 1) + 0.5));
    return [hijriYear, hijriMonth, hijriDay];
  };
  const dayIndexOfWeek = (year, month, day) => {
    const date = jalaliToGregorian(year, month, day);
    let gDate = new Date(date[0], date[1] - 1, date[2]).getDay();
    let num = ++gDate;
    if (num === 7)
      num = 0;
    return num;
  };
  const persianMonthName = (month) => persianMonthNames[month - 1];
  const hijriMonthName = (month) => hijriMonthNames[month - 1];
  const gregorianMonthName = (month) => gregorianMonthNames[month - 1];
  const nextMonth = () => {
    let year = selectedDay.value[0];
    let month = selectedDay.value[1];
    if (month === 12) {
      year++;
      month = 1;
    } else {
      month++;
    }
    selectedDay.value = [year, month, selectedDay.value[2]];
    return selectedDay.value;
  };
  const prevMonth = () => {
    let year = selectedDay.value[0];
    let month = selectedDay.value[1];
    if (month === 1) {
      year--;
      month = 12;
    } else {
      month--;
    }
    selectedDay.value = [year, month, selectedDay.value[2]];
    return selectedDay.value;
  };
  const nextYear = () => {
    selectedDay.value[0]++;
    return selectedDay.value;
  };
  const prevYear = () => {
    selectedDay.value[0]--;
    return selectedDay.value;
  };
  const setYear = (year, month) => {
    selectedDay.value[0] = year;
    if (month !== void 0)
      selectedDay.value[1] = month;
  };
  const setMonth = (month) => {
    selectedDay.value[1] = month;
  };
  const getDayInfo = (date, isHijri = false, isGregorian = false) => {
    const dayIndex = dayIndexOfWeek(date[0], date[1], date[2]);
    const monthName = persianMonthName(date[1]);
    const dayName = dayNames[dayIndex];
    let content = dayName + " ";
    if (isHijri) {
      const hijriDate = jalaliToHijri(date[0], date[1], date[2]);
      content += hijriDate[2] + "ام " + hijriMonthName(hijriDate[1]) + " سال " + hijriDate[0] + " هجری قمری";
    } else if (isGregorian) {
      const gregorianDate = jalaliToGregorian(date[0], date[1], date[2]);
      content += gregorianDate[2] + "ام " + gregorianMonthName(gregorianDate[1]) + " سال " + gregorianDate[0] + " میلادی";
    } else {
      content += date[2] + "ام " + monthName + " سال " + date[0] + " شمسی";
    }
    return content;
  };
  const getTodayPersianInfo = () => getDayInfo(today.value);
  const getSelectedDayPersianInfo = () => getDayInfo(selectedDay.value);
  const getTodayGregorianInfo = () => getDayInfo(today.value, false, true);
  const getSelectedDayGregorianInfo = () => getDayInfo(selectedDay.value, false, true);
  const getTodayHijriInfo = () => getDayInfo(today.value, true);
  const getSelectedDayHijriInfo = () => getDayInfo(selectedDay.value, true);
  const getTodayEvents = () => getDayEvents(today.value[0], today.value[1], today.value[2]);
  const getSelectedDayEvents = () => getDayEvents(selectedDay.value[0], selectedDay.value[1], selectedDay.value[2]);
  return {
    today: computed(() => today.value),
    selectedDay: computed(() => selectedDay.value),
    todayHijri: computed(() => todayHijri.value),
    todayGregorian: computed(() => todayGregorian.value),
    persianMonthName,
    hijriMonthName,
    gregorianMonthName,
    nextMonth,
    prevMonth,
    nextYear,
    prevYear,
    setYear,
    setMonth,
    getDayEvents,
    getTodayPersianInfo,
    getSelectedDayPersianInfo,
    getTodayGregorianInfo,
    getSelectedDayGregorianInfo,
    getTodayHijriInfo,
    getSelectedDayHijriInfo,
    getTodayEvents,
    getSelectedDayEvents,
    dayCountInMonth,
    jalaliToGregorian,
    jalaliToHijri,
    dayIndexOfWeek
  };
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "PersianDatePicker",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: null },
    placeholder: { default: "تاریخ را انتخاب کنید" },
    format: { default: "YYYY/MM/DD" },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: true },
    clearable: { type: Boolean, default: true },
    position: { default: "auto" },
    from: {},
    to: {},
    fontFamily: { default: "Tahoma, sans-serif" },
    defaultDate: { default: null },
    showTodayButton: { type: Boolean, default: true },
    showCloseButton: { type: Boolean, default: true },
    showOccasions: { type: Boolean, default: true },
    theme: { default: "light" },
    lightColors: {},
    darkColors: {}
  },
  emits: ["update:modelValue", "change", "open", "close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const defaultLightColors = {
      inputBg: "#fff",
      inputText: "#333",
      inputBorder: "#e0e0e0",
      inputBorderHover: "#3498db",
      inputBorderFocus: "#3498db",
      inputFocusShadow: "rgba(52, 152, 219, 0.2)",
      iconColor: "#7f8c8d",
      iconColorHover: "#3498db",
      clearColor: "#7f8c8d",
      clearColorHover: "#e74c3c",
      popupBg: "#fff",
      popupBorder: "#e0e0e0",
      popupShadow: "rgba(0, 0, 0, 0.15)",
      navBtnBg: "#f5f5f5",
      navBtnBgHover: "#e0e0e0",
      navBtnText: "#333",
      yearMonthText: "#2c3e50",
      quickBtnBg: "#3498db",
      quickBtnBgHover: "#2980b9",
      quickBtnText: "#fff",
      dayNameText: "#7f8c8d",
      dayNameBg: "transparent",
      dayBg: "transparent",
      dayText: "#333",
      dayBgHover: "#f5f5f5",
      todayBg: "#e8f0fe",
      todayText: "#3498db",
      selectedBg: "#3498db",
      selectedText: "#fff",
      fridayText: "#e74c3c",
      holidayText: "#e74c3c",
      disabledOpacity: 0.4,
      eventDotColor: "#f39c12",
      footerBorderColor: "transparent",
      footerText: "#7f8c8d"
    };
    const defaultDarkColors = {
      inputBg: "#2c3e50",
      inputText: "#ecf0f1",
      inputBorder: "#34495e",
      inputBorderHover: "#3498db",
      inputBorderFocus: "#3498db",
      inputFocusShadow: "rgba(52, 152, 219, 0.3)",
      iconColor: "#95a5a6",
      iconColorHover: "#3498db",
      clearColor: "#95a5a6",
      clearColorHover: "#e74c3c",
      popupBg: "#34495e",
      popupBorder: "#2c3e50",
      popupShadow: "rgba(0, 0, 0, 0.5)",
      navBtnBg: "#2c3e50",
      navBtnBgHover: "#1a252f",
      navBtnText: "#ecf0f1",
      yearMonthText: "#ecf0f1",
      quickBtnBg: "#3498db",
      quickBtnBgHover: "#2980b9",
      quickBtnText: "#fff",
      dayNameText: "#95a5a6",
      dayNameBg: "transparent",
      dayBg: "transparent",
      dayText: "#ecf0f1",
      dayBgHover: "#2c3e50",
      todayBg: "#2c3e50",
      todayText: "#3498db",
      selectedBg: "#3498db",
      selectedText: "#fff",
      fridayText: "#e74c3c",
      holidayText: "#e74c3c",
      disabledOpacity: 0.4,
      eventDotColor: "#f39c12",
      footerBorderColor: "#2c3e50",
      footerText: "#95a5a6"
    };
    const props = __props;
    const emit = __emit;
    const {
      today,
      persianMonthName,
      dayCountInMonth,
      dayIndexOfWeek,
      gregorianToJalali,
      getDayEvents
    } = usePersianCalendar();
    const isOpen = ref(false);
    const currentYear = ref(today.value[0]);
    const currentMonth = ref(today.value[1]);
    const selectedDate = ref(null);
    const wrapperRef = ref(null);
    ref(null);
    const popupPosition = ref("bottom");
    const dayNames = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
    const systemTheme = ref("light");
    const currentTheme = computed(() => {
      if (props.theme === "auto")
        return systemTheme.value;
      return props.theme;
    });
    const currentColors = computed(() => {
      const isLight = currentTheme.value === "light";
      const defaultColors = isLight ? defaultLightColors : defaultDarkColors;
      const customColors = isLight ? props.lightColors : props.darkColors;
      return {
        ...defaultColors,
        ...customColors
      };
    });
    const getCSSVariables = computed(() => {
      const colors = currentColors.value;
      return {
        "--input-bg": colors.inputBg,
        "--input-text": colors.inputText,
        "--input-border": colors.inputBorder,
        "--input-border-hover": colors.inputBorderHover,
        "--input-border-focus": colors.inputBorderFocus,
        "--input-focus-shadow": colors.inputFocusShadow,
        "--icon-color": colors.iconColor,
        "--icon-color-hover": colors.iconColorHover,
        "--clear-color": colors.clearColor,
        "--clear-color-hover": colors.clearColorHover,
        "--popup-bg": colors.popupBg,
        "--popup-border": colors.popupBorder,
        "--popup-shadow": colors.popupShadow,
        "--nav-btn-bg": colors.navBtnBg,
        "--nav-btn-bg-hover": colors.navBtnBgHover,
        "--nav-btn-text": colors.navBtnText,
        "--year-month-text": colors.yearMonthText,
        "--quick-btn-bg": colors.quickBtnBg,
        "--quick-btn-bg-hover": colors.quickBtnBgHover,
        "--quick-btn-text": colors.quickBtnText,
        "--day-name-text": colors.dayNameText,
        "--day-name-bg": colors.dayNameBg,
        "--day-bg": colors.dayBg,
        "--day-text": colors.dayText,
        "--day-bg-hover": colors.dayBgHover,
        "--today-bg": colors.todayBg,
        "--today-text": colors.todayText,
        "--selected-bg": colors.selectedBg,
        "--selected-text": colors.selectedText,
        "--friday-text": colors.fridayText,
        "--holiday-text": colors.holidayText,
        "--disabled-opacity": colors.disabledOpacity,
        "--event-dot-color": colors.eventDotColor,
        "--footer-border-color": colors.footerBorderColor,
        "--footer-text": colors.footerText
      };
    });
    watch(() => props.modelValue, (value) => {
      if (value) {
        if (Array.isArray(value)) {
          selectedDate.value = value;
          currentYear.value = value[0];
          currentMonth.value = value[1];
        } else if (typeof value === "string") {
          const parts = value.split(/[\/\-]/).map(Number);
          if (parts.length === 3) {
            selectedDate.value = parts;
            currentYear.value = parts[0];
            currentMonth.value = parts[1];
          }
        }
      } else {
        selectedDate.value = null;
      }
    }, { immediate: true });
    const displayValue = computed(() => {
      if (!selectedDate.value)
        return "";
      const [year, month, day] = selectedDate.value;
      if (props.format === "YYYY/MM/DD") {
        return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
      } else if (props.format === "YYYY-MM-DD") {
        return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      } else if (props.format === "DD/MM/YYYY") {
        return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
      } else if (props.format === "text") {
        return `${day} ${persianMonthName(month)} ${year}`;
      }
      return `${year}/${month}/${day}`;
    });
    const formattedSelectedDate = computed(() => {
      if (!selectedDate.value)
        return "";
      const [year, month, day] = selectedDate.value;
      return `${day} ${persianMonthName(month)} ${year}`;
    });
    const calendarDays = computed(() => {
      const year = currentYear.value;
      const month = currentMonth.value;
      const dayOfWeek = dayIndexOfWeek(year, month, 1);
      const daysCount = dayCountInMonth(year, month);
      const days = [];
      let cellCounter = 1;
      for (let i = 0; i < 42; i++) {
        if (i >= dayOfWeek && cellCounter <= daysCount) {
          const isToday = today.value[0] === year && today.value[1] === month && today.value[2] === cellCounter;
          const isSelected = selectedDate.value ? selectedDate.value[0] === year && selectedDate.value[1] === month && selectedDate.value[2] === cellCounter : false;
          const weekDay = i % 7;
          const isFriday = weekDay === 6;
          const isDisabled = checkIfDisabled(year, month, cellCounter);
          const events = props.showOccasions ? getDayEvents(year, month, cellCounter) : void 0;
          days.push({
            day: cellCounter,
            display: cellCounter.toString(),
            isToday,
            isSelected,
            isFriday,
            isHoliday: false,
            isDisabled,
            weekDay,
            events
          });
          cellCounter++;
        } else {
          days.push({
            day: 0,
            display: "",
            isToday: false,
            isSelected: false,
            isFriday: false,
            isHoliday: false,
            isDisabled: true,
            weekDay: i % 7
          });
        }
      }
      return days;
    });
    const checkIfDisabled = (year, month, day) => {
      if (props.from) {
        const [fromY, fromM, fromD] = props.from;
        if (year < fromY || year === fromY && month < fromM || year === fromY && month === fromM && day < fromD) {
          return true;
        }
      }
      if (props.to) {
        const [toY, toM, toD] = props.to;
        if (year > toY || year === toY && month > toM || year === toY && month === toM && day > toD) {
          return true;
        }
      }
      return false;
    };
    const getDayClasses = (day) => {
      return {
        "calendar-day": true,
        "today": day.isToday,
        "selected": day.isSelected,
        "friday": day.isFriday,
        "holiday": day.isHoliday,
        "disabled": day.isDisabled,
        "empty": day.day === 0,
        "has-event": day.events && (day.events.persianEvents.length > 0 || day.events.hijriEvents.length > 0)
      };
    };
    const getDayTooltip = (day) => {
      if (!day.events || day.day === 0)
        return "";
      const events = [];
      if (day.events.persianEvents.length > 0) {
        events.push(...day.events.persianEvents);
      }
      if (day.events.hijriEvents.length > 0) {
        events.push(...day.events.hijriEvents);
      }
      return events.join("\n");
    };
    const togglePopup = () => {
      if (props.disabled)
        return;
      if (isOpen.value) {
        closePopup();
      } else {
        openPopup();
      }
    };
    const openPopup = () => {
      if (props.disabled)
        return;
      if (selectedDate.value) {
        currentYear.value = selectedDate.value[0];
        currentMonth.value = selectedDate.value[1];
      } else {
        currentYear.value = today.value[0];
        currentMonth.value = today.value[1];
      }
      isOpen.value = true;
      emit("open");
      nextTick(() => {
        calculatePopupPosition();
      });
    };
    const closePopup = () => {
      isOpen.value = false;
      emit("close");
    };
    const calculatePopupPosition = () => {
      if (!wrapperRef.value)
        return;
      if (props.position === "top") {
        popupPosition.value = "top";
      } else if (props.position === "bottom") {
        popupPosition.value = "bottom";
      } else {
        const rect = wrapperRef.value.getBoundingClientRect();
        const spaceBelow = (void 0).innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        popupPosition.value = spaceBelow < 400 && spaceAbove > spaceBelow ? "top" : "bottom";
      }
    };
    const selectDate = (day) => {
      if (day.isDisabled || day.day === 0)
        return;
      selectedDate.value = [currentYear.value, currentMonth.value, day.day];
      emit("update:modelValue", selectedDate.value);
      emit("change", selectedDate.value);
      closePopup();
    };
    const selectToday = () => {
      selectedDate.value = [...today.value];
      currentYear.value = today.value[0];
      currentMonth.value = today.value[1];
      emit("update:modelValue", selectedDate.value);
      emit("change", selectedDate.value);
      closePopup();
    };
    const clearDate = () => {
      selectedDate.value = null;
      emit("update:modelValue", null);
      emit("change", null);
    };
    const handleNextMonth = () => {
      if (currentMonth.value === 12) {
        currentMonth.value = 1;
        currentYear.value++;
      } else {
        currentMonth.value++;
      }
    };
    const handlePrevMonth = () => {
      if (currentMonth.value === 1) {
        currentMonth.value = 12;
        currentYear.value--;
      } else {
        currentMonth.value--;
      }
    };
    const handleNextYear = () => {
      currentYear.value++;
    };
    const handlePrevYear = () => {
      currentYear.value--;
    };
    const onFocus = () => {
      if (!props.readonly)
        return;
    };
    const onBlur = () => {
    };
    const setDate = (date) => {
      if (!date) {
        selectedDate.value = null;
        emit("update:modelValue", null);
        emit("change", null);
        return;
      }
      if (Array.isArray(date)) {
        selectedDate.value = date;
        currentYear.value = date[0];
        currentMonth.value = date[1];
      } else if (typeof date === "string") {
        const parts = date.split(/[\/\-]/).map(Number);
        if (parts.length === 3) {
          selectedDate.value = parts;
          currentYear.value = parts[0];
          currentMonth.value = parts[1];
        }
      }
      emit("update:modelValue", selectedDate.value);
      emit("change", selectedDate.value);
    };
    const setDateFromGregorian = (gregorianDate) => {
      let gYear, gMonth, gDay;
      if (Array.isArray(gregorianDate)) {
        [gYear, gMonth, gDay] = gregorianDate;
      } else {
        const parts = gregorianDate.split(/[\/\-]/).map(Number);
        if (parts.length !== 3)
          return;
        [gYear, gMonth, gDay] = parts;
      }
      const jalaliDate = gregorianToJalali(gYear, gMonth, gDay);
      setDate(jalaliDate);
    };
    const getSelectedDate = () => {
      return selectedDate.value;
    };
    __expose({
      setDate,
      setDateFromGregorian,
      getSelectedDate,
      selectToday,
      clearDate,
      openPopup,
      closePopup
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["persian-datepicker-wrapper", [`theme-${currentTheme.value}`]],
        ref_key: "wrapperRef",
        ref: wrapperRef,
        style: { fontFamily: __props.fontFamily, ...getCSSVariables.value }
      }, _attrs))} data-v-5ffb5803>`);
      ssrRenderSlot(_ctx.$slots, "input", {
        displayValue: displayValue.value,
        togglePopup,
        clearDate,
        isOpen: isOpen.value
      }, () => {
        _push(`<div class="datepicker-input-container" data-v-5ffb5803>`);
        ssrRenderSlot(_ctx.$slots, "input-field", {
          displayValue: displayValue.value,
          togglePopup,
          onFocus,
          onBlur
        }, () => {
          _push(`<input type="text"${ssrRenderAttr("value", displayValue.value)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.readonly) ? " readonly" : ""} class="datepicker-input" data-v-5ffb5803>`);
        }, _push, _parent);
        ssrRenderSlot(_ctx.$slots, "icon", { togglePopup }, () => {
          _push(`<span class="datepicker-icon" data-v-5ffb5803><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5ffb5803><rect x="3" y="4" width="18" height="18" rx="2" ry="2" data-v-5ffb5803></rect><line x1="16" y1="2" x2="16" y2="6" data-v-5ffb5803></line><line x1="8" y1="2" x2="8" y2="6" data-v-5ffb5803></line><line x1="3" y1="10" x2="21" y2="10" data-v-5ffb5803></line></svg></span>`);
        }, _push, _parent);
        ssrRenderSlot(_ctx.$slots, "clear-button", {
          clearDate,
          displayValue: displayValue.value
        }, () => {
          if (__props.clearable && displayValue.value) {
            _push(`<button class="datepicker-clear" type="button" data-v-5ffb5803> × </button>`);
          } else {
            _push(`<!---->`);
          }
        }, _push, _parent);
        _push(`</div>`);
      }, _push, _parent);
      if (isOpen.value) {
        ssrRenderSlotInner(_ctx.$slots, "popup", {
          closePopup,
          selectToday,
          calendarDays: calendarDays.value,
          selectDate,
          currentYear: currentYear.value,
          currentMonth: currentMonth.value,
          formattedSelectedDate: formattedSelectedDate.value
        }, () => {
          if (isOpen.value) {
            _push(`<div class="datepicker-popup" data-v-5ffb5803>`);
            ssrRenderSlot(_ctx.$slots, "popup-header", {
              currentYear: currentYear.value,
              currentMonth: currentMonth.value,
              handleNextYear,
              handlePrevYear,
              handleNextMonth,
              handlePrevMonth,
              persianMonthName: unref(persianMonthName)
            }, () => {
              _push(`<div class="datepicker-header" data-v-5ffb5803>`);
              ssrRenderSlot(_ctx.$slots, "year-selector", {
                currentYear: currentYear.value,
                handleNextYear,
                handlePrevYear
              }, () => {
                _push(`<div class="year-selector" data-v-5ffb5803><button class="nav-btn" type="button" data-v-5ffb5803>`);
                ssrRenderSlot(_ctx.$slots, "next-year-icon", {}, () => {
                  _push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5ffb5803><polyline points="9 18 15 12 9 6" data-v-5ffb5803></polyline></svg>`);
                }, _push, _parent);
                _push(`</button><span class="year-display" data-v-5ffb5803>`);
                ssrRenderSlot(_ctx.$slots, "year-display", { year: currentYear.value }, () => {
                  _push(`${ssrInterpolate(currentYear.value)}`);
                }, _push, _parent);
                _push(`</span><button class="nav-btn" type="button" data-v-5ffb5803>`);
                ssrRenderSlot(_ctx.$slots, "prev-year-icon", {}, () => {
                  _push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5ffb5803><polyline points="15 18 9 12 15 6" data-v-5ffb5803></polyline></svg>`);
                }, _push, _parent);
                _push(`</button></div>`);
              }, _push, _parent);
              ssrRenderSlot(_ctx.$slots, "month-selector", {
                currentMonth: currentMonth.value,
                monthName: unref(persianMonthName)(currentMonth.value),
                handleNextMonth,
                handlePrevMonth
              }, () => {
                _push(`<div class="month-selector" data-v-5ffb5803><button class="nav-btn" type="button" data-v-5ffb5803>`);
                ssrRenderSlot(_ctx.$slots, "next-month-icon", {}, () => {
                  _push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5ffb5803><polyline points="9 18 15 12 9 6" data-v-5ffb5803></polyline></svg>`);
                }, _push, _parent);
                _push(`</button><span class="month-display" data-v-5ffb5803>`);
                ssrRenderSlot(_ctx.$slots, "month-display", {
                  month: currentMonth.value,
                  monthName: unref(persianMonthName)(currentMonth.value)
                }, () => {
                  _push(`${ssrInterpolate(unref(persianMonthName)(currentMonth.value))}`);
                }, _push, _parent);
                _push(`</span><button class="nav-btn" type="button" data-v-5ffb5803>`);
                ssrRenderSlot(_ctx.$slots, "prev-month-icon", {}, () => {
                  _push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-5ffb5803><polyline points="15 18 9 12 15 6" data-v-5ffb5803></polyline></svg>`);
                }, _push, _parent);
                _push(`</button></div>`);
              }, _push, _parent);
              _push(`</div>`);
            }, _push, _parent);
            ssrRenderSlot(_ctx.$slots, "quick-actions", {
              selectToday,
              closePopup
            }, () => {
              if (__props.showTodayButton || __props.showCloseButton) {
                _push(`<div class="datepicker-quick-actions" data-v-5ffb5803>`);
                ssrRenderSlot(_ctx.$slots, "today-button", { selectToday }, () => {
                  if (__props.showTodayButton) {
                    _push(`<button class="quick-btn" type="button" data-v-5ffb5803> امروز </button>`);
                  } else {
                    _push(`<!---->`);
                  }
                }, _push, _parent);
                ssrRenderSlot(_ctx.$slots, "close-button", { closePopup }, () => {
                  if (__props.showCloseButton) {
                    _push(`<button class="quick-btn" type="button" data-v-5ffb5803> بستن </button>`);
                  } else {
                    _push(`<!---->`);
                  }
                }, _push, _parent);
                _push(`</div>`);
              } else {
                _push(`<!---->`);
              }
            }, _push, _parent);
            ssrRenderSlot(_ctx.$slots, "day-names", { dayNames }, () => {
              _push(`<div class="datepicker-days-header" data-v-5ffb5803><!--[-->`);
              ssrRenderList(dayNames, (day, index) => {
                _push(`<div class="day-name" data-v-5ffb5803>`);
                ssrRenderSlot(_ctx.$slots, "day-name", {
                  day,
                  index
                }, () => {
                  _push(`${ssrInterpolate(day)}`);
                }, _push, _parent);
                _push(`</div>`);
              });
              _push(`<!--]--></div>`);
            }, _push, _parent);
            ssrRenderSlot(_ctx.$slots, "calendar-grid", {
              calendarDays: calendarDays.value,
              selectDate,
              getDayClasses
            }, () => {
              _push(`<div class="datepicker-days" data-v-5ffb5803><!--[-->`);
              ssrRenderList(calendarDays.value, (day, index) => {
                _push(`<div class="${ssrRenderClass(getDayClasses(day))}"${ssrRenderAttr("title", __props.showOccasions ? getDayTooltip(day) : "")} data-v-5ffb5803>`);
                ssrRenderSlot(_ctx.$slots, "day-cell", {
                  day,
                  index
                }, () => {
                  _push(`<span data-v-5ffb5803>${ssrInterpolate(day.display)}</span>`);
                }, _push, _parent);
                _push(`</div>`);
              });
              _push(`<!--]--></div>`);
            }, _push, _parent);
            ssrRenderSlot(_ctx.$slots, "popup-footer", {
              selectedDate: selectedDate.value,
              formattedSelectedDate: formattedSelectedDate.value
            }, () => {
              if (selectedDate.value) {
                _push(`<div class="datepicker-footer" data-v-5ffb5803>`);
                ssrRenderSlot(_ctx.$slots, "selected-date-text", { formattedDate: formattedSelectedDate.value }, () => {
                  _push(`<span class="selected-date-text" data-v-5ffb5803>${ssrInterpolate(formattedSelectedDate.value)}</span>`);
                }, _push, _parent);
                _push(`</div>`);
              } else {
                _push(`<!---->`);
              }
            }, _push, _parent);
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
        }, _push, _parent, null, true);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../src/runtime/components/PersianDatePicker.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-5ffb5803"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "PersianCalendar",
  __ssrInlineRender: true,
  props: {
    from: {},
    to: {},
    showInfo: { type: Boolean, default: true },
    showEvents: { type: Boolean, default: true },
    fontFamily: { default: "Tahoma, sans-serif" },
    defaultDate: { default: null },
    showOccasions: { type: Boolean, default: true },
    theme: { default: "light" },
    lightColors: {},
    darkColors: {}
  },
  emits: ["select-date", "update-today"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const defaultLightColors = {
      background: "#f5f5f5",
      text: "#333",
      navButton: "#cccccc",
      navButtonHover: "#b8b8b8",
      dayNameBg: "#e0e0e0",
      dayNameText: "#333",
      dayBg: "#ffffff",
      dayText: "#333",
      dayHover: "#e8e8e8",
      todayBg: "rgba(76, 79, 255, 0.53)",
      todayText: "#ffffff",
      selectedBg: "rgba(117, 206, 72, 0.49)",
      selectedText: "#ffffff",
      fridayBg: "rgba(255, 52, 52, 0.55)",
      fridayText: "#ffffff",
      infoBg: "#ffffff",
      infoText: "#333",
      border: "#ccc",
      disabledOpacity: 0.3
    };
    const defaultDarkColors = {
      background: "#2c3e50",
      text: "#ecf0f1",
      navButton: "#34495e",
      navButtonHover: "#1a252f",
      dayNameBg: "#34495e",
      dayNameText: "#ecf0f1",
      dayBg: "#34495e",
      dayText: "#ecf0f1",
      dayHover: "#1a252f",
      todayBg: "rgba(52, 152, 219, 0.6)",
      todayText: "#ffffff",
      selectedBg: "rgba(46, 204, 113, 0.6)",
      selectedText: "#ffffff",
      fridayBg: "rgba(231, 76, 60, 0.6)",
      fridayText: "#ffffff",
      infoBg: "#34495e",
      infoText: "#ecf0f1",
      border: "#2c3e50",
      disabledOpacity: 0.3
    };
    const props = __props;
    const emit = __emit;
    const {
      today,
      selectedDay: composableSelectedDay,
      persianMonthName,
      nextMonth: composableNextMonth,
      prevMonth: composablePrevMonth,
      nextYear: composableNextYear,
      prevYear: composablePrevYear,
      getTodayEvents,
      getSelectedDayEvents,
      getSelectedDayPersianInfo,
      getSelectedDayHijriInfo,
      getSelectedDayGregorianInfo,
      dayCountInMonth,
      dayIndexOfWeek,
      gregorianToJalali,
      getDayEvents
    } = usePersianCalendar();
    const selectedDay = ref([...composableSelectedDay.value]);
    const currentEvents = ref(getTodayEvents());
    const dayNames = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
    const systemTheme = ref("light");
    const currentTheme = computed(() => {
      if (props.theme === "auto")
        return systemTheme.value;
      return props.theme;
    });
    const currentColors = computed(() => {
      const isLight = currentTheme.value === "light";
      const defaultColors = isLight ? defaultLightColors : defaultDarkColors;
      const customColors = isLight ? props.lightColors : props.darkColors;
      return {
        ...defaultColors,
        ...customColors
      };
    });
    const getCSSVariables = computed(() => {
      const colors = currentColors.value;
      return {
        "--bg-color": colors.background,
        "--text-color": colors.text,
        "--nav-btn-color": colors.navButton,
        "--nav-btn-hover": colors.navButtonHover,
        "--day-name-bg": colors.dayNameBg,
        "--day-name-text": colors.dayNameText,
        "--day-bg": colors.dayBg,
        "--day-text": colors.dayText,
        "--day-hover": colors.dayHover,
        "--today-bg": colors.todayBg,
        "--today-text": colors.todayText,
        "--selected-bg": colors.selectedBg,
        "--selected-text": colors.selectedText,
        "--friday-bg": colors.fridayBg,
        "--friday-text": colors.fridayText,
        "--info-bg": colors.infoBg,
        "--info-text": colors.infoText,
        "--border-color": colors.border,
        "--disabled-opacity": colors.disabledOpacity
      };
    });
    const calendarDays = computed(() => {
      const year = selectedDay.value[0];
      const month = selectedDay.value[1];
      const dayOfWeek = dayIndexOfWeek(year, month, 1);
      const daysCount = dayCountInMonth(year, month);
      const days = [];
      let cellCounter = 1;
      for (let i = 0; i < 42; i++) {
        if (i >= dayOfWeek && cellCounter <= daysCount) {
          const isToday = today.value[0] === year && today.value[1] === month && today.value[2] === cellCounter;
          const isSelected = selectedDay.value[2] === cellCounter;
          const weekDay = i % 7;
          const isFriday = weekDay === 6;
          const isDisabled = checkIfDisabled(year, month, cellCounter);
          const events = props.showOccasions ? getDayEvents(year, month, cellCounter) : void 0;
          days.push({
            day: cellCounter,
            display: cellCounter.toString(),
            title: `${dayNames[weekDay]} ${cellCounter} ${persianMonthName(month)} ${year}`,
            isToday,
            isSelected,
            isFriday,
            isHoliday: false,
            isDisabled,
            weekDay,
            events
          });
          cellCounter++;
        } else {
          days.push({
            day: 0,
            display: ".",
            title: "",
            isToday: false,
            isSelected: false,
            isFriday: false,
            isHoliday: false,
            isDisabled: true,
            weekDay: i % 7
          });
        }
      }
      return days;
    });
    const checkIfDisabled = (year, month, day) => {
      if (props.from) {
        const [fromY, fromM, fromD] = props.from;
        if (year < fromY || year === fromY && month < fromM || year === fromY && month === fromM && day < fromD) {
          return true;
        }
      }
      if (props.to) {
        const [toY, toM, toD] = props.to;
        if (year > toY || year === toY && month > toM || year === toY && month === toM && day > toD) {
          return true;
        }
      }
      return false;
    };
    const getDayClasses = (day) => {
      return {
        "calendar-day": true,
        "today": day.isToday,
        "selected": day.isSelected,
        "friday": day.isFriday,
        "holiday": day.isHoliday,
        "disabled": day.isDisabled,
        "has-event": day.events && (day.events.persianEvents.length > 0 || day.events.hijriEvents.length > 0)
      };
    };
    const getDayTooltip = (day) => {
      if (!day.events || day.day === 0)
        return day.title;
      const events = [day.title];
      if (day.events.persianEvents.length > 0) {
        events.push("", "🎉 رویدادهای ایرانی:");
        events.push(...day.events.persianEvents);
      }
      if (day.events.hijriEvents.length > 0) {
        events.push("", "🌙 رویدادهای اسلامی:");
        events.push(...day.events.hijriEvents);
      }
      return events.join("\n");
    };
    const selectDay = (day) => {
      if (day.isDisabled)
        return;
      selectedDay.value[2] = day.day;
      currentEvents.value = getSelectedDayEvents();
      emit(
        "select-date",
        {
          date: [...selectedDay.value],
          events: currentEvents.value
        }
      );
    };
    const handleNextMonth = () => {
      composableNextMonth();
      selectedDay.value = [...composableSelectedDay.value];
    };
    const handlePrevMonth = () => {
      composablePrevMonth();
      selectedDay.value = [...composableSelectedDay.value];
    };
    const handleNextYear = () => {
      composableNextYear();
      selectedDay.value = [...composableSelectedDay.value];
    };
    const handlePrevYear = () => {
      composablePrevYear();
      selectedDay.value = [...composableSelectedDay.value];
    };
    const setDate = (date) => {
      if (!date) {
        selectedDay.value = [...today.value];
        return;
      }
      if (Array.isArray(date)) {
        selectedDay.value = date;
      } else if (typeof date === "string") {
        const parts = date.split(/[\/\-]/).map(Number);
        if (parts.length === 3) {
          selectedDay.value = parts;
        }
      }
    };
    const setDateFromGregorian = (gregorianDate) => {
      let gYear, gMonth, gDay;
      if (Array.isArray(gregorianDate)) {
        [gYear, gMonth, gDay] = gregorianDate;
      } else {
        const parts = gregorianDate.split(/[\/\-]/).map(Number);
        if (parts.length !== 3) return;
        [gYear, gMonth, gDay] = parts;
      }
      const jalaliDate = gregorianToJalali(gYear, gMonth, gDay);
      setDate(jalaliDate);
    };
    const getSelectedDate = () => {
      return [...selectedDay.value];
    };
    const goToToday = () => {
      selectedDay.value = [...today.value];
      currentEvents.value = getTodayEvents();
    };
    __expose({
      setDate,
      setDateFromGregorian,
      getSelectedDate,
      goToToday
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["persian-calendar", [`theme-${currentTheme.value}`]],
        style: { fontFamily: __props.fontFamily, ...getCSSVariables.value }
      }, _attrs))} data-v-b56b1b89>`);
      ssrRenderSlot(_ctx.$slots, "header", {
        selectedDay: selectedDay.value,
        persianMonthName: unref(persianMonthName),
        handleNextYear,
        handlePrevYear,
        handleNextMonth,
        handlePrevMonth
      }, () => {
        _push(`<div class="calendar-header" data-v-b56b1b89>`);
        ssrRenderSlot(_ctx.$slots, "year-selector", {
          year: selectedDay.value[0],
          handleNextYear,
          handlePrevYear
        }, () => {
          _push(`<div class="year-selector" data-v-b56b1b89><button class="nav-btn" data-v-b56b1b89>`);
          ssrRenderSlot(_ctx.$slots, "next-year-icon", {}, () => {
            _push(` سال بعد `);
          }, _push, _parent);
          _push(`</button><span class="year-display" data-v-b56b1b89>`);
          ssrRenderSlot(_ctx.$slots, "year-display", {
            year: selectedDay.value[0]
          }, () => {
            _push(`${ssrInterpolate(selectedDay.value[0])}`);
          }, _push, _parent);
          _push(`</span><button class="nav-btn" data-v-b56b1b89>`);
          ssrRenderSlot(_ctx.$slots, "prev-year-icon", {}, () => {
            _push(` سال قبل `);
          }, _push, _parent);
          _push(`</button></div>`);
        }, _push, _parent);
        ssrRenderSlot(_ctx.$slots, "month-selector", {
          month: selectedDay.value[1],
          monthName: unref(persianMonthName)(selectedDay.value[1]),
          handleNextMonth,
          handlePrevMonth
        }, () => {
          _push(`<div class="month-selector" data-v-b56b1b89><button class="nav-btn" data-v-b56b1b89>`);
          ssrRenderSlot(_ctx.$slots, "next-month-icon", {}, () => {
            _push(` ماه بعد `);
          }, _push, _parent);
          _push(`</button><span class="month-display" data-v-b56b1b89>`);
          ssrRenderSlot(_ctx.$slots, "month-display", {
            month: selectedDay.value[1],
            monthName: unref(persianMonthName)(selectedDay.value[1])
          }, () => {
            _push(`${ssrInterpolate(unref(persianMonthName)(selectedDay.value[1]))}`);
          }, _push, _parent);
          _push(`</span><button class="nav-btn" data-v-b56b1b89>`);
          ssrRenderSlot(_ctx.$slots, "prev-month-icon", {}, () => {
            _push(` ماه قبل `);
          }, _push, _parent);
          _push(`</button></div>`);
        }, _push, _parent);
        _push(`</div>`);
      }, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "day-names", { dayNames }, () => {
        _push(`<div class="day-names" data-v-b56b1b89><!--[-->`);
        ssrRenderList(dayNames, (day, index) => {
          _push(`<div class="day-name" data-v-b56b1b89>`);
          ssrRenderSlot(_ctx.$slots, "day-name", {
            day,
            index
          }, () => {
            _push(`${ssrInterpolate(day)}`);
          }, _push, _parent);
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "calendar-grid", {
        calendarDays: calendarDays.value,
        selectDay,
        getDayClasses
      }, () => {
        _push(`<div class="calendar-days" data-v-b56b1b89><!--[-->`);
        ssrRenderList(calendarDays.value, (day, index) => {
          _push(`<div class="${ssrRenderClass(getDayClasses(day))}"${ssrRenderAttr("title", __props.showOccasions ? getDayTooltip(day) : day.title)} data-v-b56b1b89>`);
          ssrRenderSlot(_ctx.$slots, "day-cell", {
            day,
            index
          }, () => {
            _push(`<span data-v-b56b1b89>${ssrInterpolate(day.display)}</span>`);
          }, _push, _parent);
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }, _push, _parent);
      if (__props.showInfo) {
        ssrRenderSlot(_ctx.$slots, "day-info", {
          persianInfo: unref(getSelectedDayPersianInfo)(),
          hijriInfo: unref(getSelectedDayHijriInfo)(),
          gregorianInfo: unref(getSelectedDayGregorianInfo)(),
          selectedDay: selectedDay.value
        }, () => {
          _push(`<div class="day-info" data-v-b56b1b89>`);
          ssrRenderSlot(_ctx.$slots, "persian-info", {
            info: unref(getSelectedDayPersianInfo)()
          }, () => {
            _push(`<p data-v-b56b1b89>${ssrInterpolate(unref(getSelectedDayPersianInfo)())}</p>`);
          }, _push, _parent);
          ssrRenderSlot(_ctx.$slots, "hijri-info", {
            info: unref(getSelectedDayHijriInfo)()
          }, () => {
            _push(`<p data-v-b56b1b89>${ssrInterpolate(unref(getSelectedDayHijriInfo)())}</p>`);
          }, _push, _parent);
          ssrRenderSlot(_ctx.$slots, "gregorian-info", {
            info: unref(getSelectedDayGregorianInfo)()
          }, () => {
            _push(`<p data-v-b56b1b89>${ssrInterpolate(unref(getSelectedDayGregorianInfo)())}</p>`);
          }, _push, _parent);
          _push(`</div>`);
        }, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      if (__props.showEvents) {
        ssrRenderSlot(_ctx.$slots, "events", { events: currentEvents.value }, () => {
          _push(`<div class="day-events" data-v-b56b1b89>`);
          ssrRenderSlot(_ctx.$slots, "persian-events", {
            events: currentEvents.value.persianEvents
          }, () => {
            if (currentEvents.value.persianEvents.length) {
              _push(`<div class="event-group" data-v-b56b1b89><!--[-->`);
              ssrRenderList(currentEvents.value.persianEvents, (event, i) => {
                _push(`<span data-v-b56b1b89>`);
                ssrRenderSlot(_ctx.$slots, "persian-event", {
                  event,
                  index: i
                }, () => {
                  _push(`${ssrInterpolate(event)}`);
                }, _push, _parent);
                _push(`</span>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
          }, _push, _parent);
          ssrRenderSlot(_ctx.$slots, "hijri-events", {
            events: currentEvents.value.hijriEvents
          }, () => {
            if (currentEvents.value.hijriEvents.length) {
              _push(`<div class="event-group" data-v-b56b1b89><!--[-->`);
              ssrRenderList(currentEvents.value.hijriEvents, (event, i) => {
                _push(`<span data-v-b56b1b89>`);
                ssrRenderSlot(_ctx.$slots, "hijri-event", {
                  event,
                  index: i
                }, () => {
                  _push(`${ssrInterpolate(event)}`);
                }, _push, _parent);
                _push(`</span>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
          }, _push, _parent);
          _push(`</div>`);
        }, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "footer", {
        selectedDay: selectedDay.value,
        currentEvents: currentEvents.value
      }, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../src/runtime/components/PersianCalendar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-b56b1b89"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      today,
      persianMonthName,
      hijriMonthName,
      gregorianMonthName,
      jalaliToHijri,
      dayCountInMonth
    } = usePersianCalendar();
    const activeTab = ref("datepicker");
    const tabs = [
      { id: "datepicker", label: "انتخابگر تاریخ", icon: "📅" },
      { id: "calendar", label: "تقویم", icon: "📆" },
      { id: "slots", label: "Slots سفارشی", icon: "🎨" },
      { id: "api", label: "API", icon: "⚙️" }
    ];
    const dates = ref({
      basic: null,
      format1: null,
      format2: null,
      format3: null,
      format4: null,
      future: null,
      past: null,
      currentMonth: null,
      customIcon: null,
      customInput: null,
      customDayCell: null,
      customActions: null,
      customHeader: null,
      customFooter: null
    });
    const calendarDates = ref({
      basic: null,
      customHeader: null,
      customDay: null,
      programmatic: null
    });
    const dateRange = ref({
      start: null,
      end: null
    });
    const convertYear = ref(1403);
    const convertMonth = ref(7);
    const convertDay = ref(15);
    const convertedDates = ref(null);
    const programmaticDate = ref(null);
    const programmaticPicker = ref(null);
    const customActionsPicker = ref(null);
    const basicCalendar = ref(null);
    const customCalendarHeader = ref(null);
    const customDayCalendar = ref(null);
    const programmaticCalendar = ref(null);
    const todayPersianInfo = computed(() => {
      const [year, month, day] = today.value;
      return `${day} ${persianMonthName(month)} ${year}`;
    });
    const todayHijriInfo = computed(() => {
      const [hYear, hMonth, hDay] = jalaliToHijri(today.value[0], today.value[1], today.value[2]);
      return `${hDay} ${hijriMonthName(hMonth)} ${hYear}`;
    });
    const currentMonthStart = computed(() => [today.value[0], today.value[1], 1]);
    const currentMonthEnd = computed(() => {
      const days = dayCountInMonth(today.value[0], today.value[1]);
      return [today.value[0], today.value[1], days];
    });
    const dateRangeDays = computed(() => {
      if (!dateRange.value.start || !dateRange.value.end)
        return null;
      const [y1, m1, d1] = dateRange.value.start;
      const [y2, m2, d2] = dateRange.value.end;
      let days = 0;
      let currentYear = y1;
      let currentMonth = m1;
      let currentDay = d1;
      while (currentYear < y2 || currentYear === y2 && currentMonth < m2 || currentYear === y2 && currentMonth === m2 && currentDay <= d2) {
        days++;
        currentDay++;
        const monthDays = dayCountInMonth(currentYear, currentMonth);
        if (currentDay > monthDays) {
          currentDay = 1;
          currentMonth++;
          if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
          }
        }
      }
      return days;
    });
    const formatDate = (date) => {
      if (!date)
        return "";
      const [year, month, day] = date;
      return `${day} ${persianMonthName(month)} ${year}`;
    };
    const handleDateChange = (type, value) => {
      console.log(`${type} date changed:`, value);
    };
    const handleCalendarDateChange = (type, event) => {
      calendarDates.value[type] = event.date;
      console.log(`${type} calendar date changed:`, event.date);
    };
    const selectYesterday = () => {
      const [y, m, d] = today.value;
      let newDay = d - 1;
      let newMonth = m;
      let newYear = y;
      if (newDay < 1) {
        newMonth--;
        if (newMonth < 1) {
          newMonth = 12;
          newYear--;
        }
        newDay = dayCountInMonth(newYear, newMonth);
      }
      customActionsPicker.value?.setDate([newYear, newMonth, newDay]);
    };
    const handleFooterAction = () => {
      alert("تاریخ ذخیره شد!");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PersianDatePicker = __nuxt_component_0;
      const _component_PersianCalendar = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "playground-container" }, _attrs))} data-v-03901f9e><header class="header" data-v-03901f9e><h1 data-v-03901f9e> تقویم شمسی ایران </h1><p class="subtitle" data-v-03901f9e> Vue Persian DatePicker &amp; Calendar - With Slots </p><div class="header-info" data-v-03901f9e><span data-v-03901f9e>${ssrInterpolate(todayPersianInfo.value)}</span><span data-v-03901f9e>${ssrInterpolate(todayHijriInfo.value)}</span></div></header><div class="tabs" data-v-03901f9e><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass(["tab", { active: activeTab.value === tab.id }])}" data-v-03901f9e>${ssrInterpolate(tab.icon)} ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><div class="content" data-v-03901f9e><section class="tab-content" style="${ssrRenderStyle(activeTab.value === "datepicker" ? null : { display: "none" })}" data-v-03901f9e><h2 data-v-03901f9e> انتخابگر تاریخ (DatePicker) </h2><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۱. استفاده پایه </h3>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.basic,
        "onUpdate:modelValue": ($event) => dates.value.basic = $event,
        placeholder: "تاریخ را انتخاب کنید",
        onChange: ($event) => handleDateChange("basic", $event),
        "show-today-button": true,
        "show-close-button": true,
        "show-occasions": true
      }, null, _parent));
      if (dates.value.basic) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e> مقدار انتخابی: </strong> ${ssrInterpolate(formatDate(dates.value.basic))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۲. فرمت‌های مختلف </h3><div class="format-grid" data-v-03901f9e><div data-v-03901f9e><label data-v-03901f9e> YYYY/MM/DD </label>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.format1,
        "onUpdate:modelValue": ($event) => dates.value.format1 = $event,
        format: "YYYY/MM/DD",
        placeholder: "YYYY/MM/DD"
      }, null, _parent));
      _push(`</div><div data-v-03901f9e><label data-v-03901f9e> DD/MM/YYYY </label>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.format2,
        "onUpdate:modelValue": ($event) => dates.value.format2 = $event,
        format: "DD/MM/YYYY",
        placeholder: "DD/MM/YYYY"
      }, null, _parent));
      _push(`</div><div data-v-03901f9e><label data-v-03901f9e> متنی (Text) </label>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.format3,
        "onUpdate:modelValue": ($event) => dates.value.format3 = $event,
        format: "text",
        placeholder: "متنی"
      }, null, _parent));
      _push(`</div><div data-v-03901f9e><label data-v-03901f9e> YYYY-MM-DD </label>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.format4,
        "onUpdate:modelValue": ($event) => dates.value.format4 = $event,
        format: "YYYY-MM-DD",
        placeholder: "YYYY-MM-DD"
      }, null, _parent));
      _push(`</div></div></div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۳. بازه تاریخ (Date Range) </h3><div class="date-range" data-v-03901f9e><div data-v-03901f9e><label data-v-03901f9e> از تاریخ: </label>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dateRange.value.start,
        "onUpdate:modelValue": ($event) => dateRange.value.start = $event,
        placeholder: "تاریخ شروع",
        to: dateRange.value.end
      }, null, _parent));
      _push(`</div><div data-v-03901f9e><label data-v-03901f9e> تا تاریخ: </label>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dateRange.value.end,
        "onUpdate:modelValue": ($event) => dateRange.value.end = $event,
        placeholder: "تاریخ پایان",
        from: dateRange.value.start
      }, null, _parent));
      _push(`</div></div>`);
      if (dateRangeDays.value) {
        _push(`<div class="result success" data-v-03901f9e> تعداد روزهای بازه: <strong data-v-03901f9e>${ssrInterpolate(dateRangeDays.value)} روز </strong></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۴. محدودیت تاریخ </h3><div class="limits-grid" data-v-03901f9e><div data-v-03901f9e><label data-v-03901f9e> فقط آینده (از امروز) </label>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.future,
        "onUpdate:modelValue": ($event) => dates.value.future = $event,
        from: unref(today),
        placeholder: "فقط تاریخ‌های آینده"
      }, null, _parent));
      _push(`</div><div data-v-03901f9e><label data-v-03901f9e> فقط گذشته (تا امروز) </label>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.past,
        "onUpdate:modelValue": ($event) => dates.value.past = $event,
        to: unref(today),
        placeholder: "فقط تاریخ‌های گذشته"
      }, null, _parent));
      _push(`</div><div data-v-03901f9e><label data-v-03901f9e> ماه جاری </label>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.currentMonth,
        "onUpdate:modelValue": ($event) => dates.value.currentMonth = $event,
        from: currentMonthStart.value,
        to: currentMonthEnd.value,
        placeholder: "فقط ماه جاری"
      }, null, _parent));
      _push(`</div></div></div></section><section class="tab-content" style="${ssrRenderStyle(activeTab.value === "calendar" ? null : { display: "none" })}" data-v-03901f9e><h2 data-v-03901f9e> تقویم شمسی </h2><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۱. تقویم پایه </h3>`);
      _push(ssrRenderComponent(_component_PersianCalendar, {
        ref_key: "basicCalendar",
        ref: basicCalendar,
        onSelectDate: ($event) => handleCalendarDateChange("basic", $event),
        "show-info": true,
        "show-events": true,
        "show-occasions": true
      }, null, _parent));
      if (calendarDates.value.basic) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e> تاریخ انتخابی: </strong> ${ssrInterpolate(formatDate(calendarDates.value.basic))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۲. هدر سفارشی تقویم </h3>`);
      _push(ssrRenderComponent(_component_PersianCalendar, {
        ref_key: "customCalendarHeader",
        ref: customCalendarHeader,
        onSelectDate: ($event) => handleCalendarDateChange("customHeader", $event)
      }, {
        header: withCtx(({ selectedDay, persianMonthName: persianMonthName2, handleNextMonth, handlePrevMonth }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="custom-calendar-header" data-v-03901f9e${_scopeId}><button class="calendar-nav-btn" data-v-03901f9e${_scopeId}> ► ماه قبل </button><h3 data-v-03901f9e${_scopeId}>${ssrInterpolate(persianMonthName2(selectedDay[1]))} ${ssrInterpolate(selectedDay[0])}</h3><button class="calendar-nav-btn" data-v-03901f9e${_scopeId}> ماه بعد ◄ </button></div>`);
          } else {
            return [
              createVNode("div", { class: "custom-calendar-header" }, [
                createVNode("button", {
                  onClick: handlePrevMonth,
                  class: "calendar-nav-btn"
                }, " ► ماه قبل ", 8, ["onClick"]),
                createVNode("h3", null, toDisplayString(persianMonthName2(selectedDay[1])) + " " + toDisplayString(selectedDay[0]), 1),
                createVNode("button", {
                  onClick: handleNextMonth,
                  class: "calendar-nav-btn"
                }, " ماه بعد ◄ ", 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (calendarDates.value.customHeader) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e> تاریخ انتخابی: </strong> ${ssrInterpolate(formatDate(calendarDates.value.customHeader))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۳. سلول روز سفارشی </h3>`);
      _push(ssrRenderComponent(_component_PersianCalendar, {
        ref_key: "customDayCalendar",
        ref: customDayCalendar,
        onSelectDate: ($event) => handleCalendarDateChange("customDay", $event)
      }, {
        "day-cell": withCtx(({ day }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="custom-day-cell" data-v-03901f9e${_scopeId}><span data-v-03901f9e${_scopeId}>${ssrInterpolate(day.display)}</span>`);
            if (day.isToday) {
              _push2(`<span class="today-badge" data-v-03901f9e${_scopeId}> امروز </span>`);
            } else {
              _push2(`<!---->`);
            }
            if (day.isFriday) {
              _push2(`<span class="friday-badge" data-v-03901f9e${_scopeId}> جمعه </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "custom-day-cell" }, [
                createVNode("span", null, toDisplayString(day.display), 1),
                day.isToday ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "today-badge"
                }, " امروز ")) : createCommentVNode("", true),
                day.isFriday ? (openBlock(), createBlock("span", {
                  key: 1,
                  class: "friday-badge"
                }, " جمعه ")) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (calendarDates.value.customDay) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e> تاریخ انتخابی: </strong> ${ssrInterpolate(formatDate(calendarDates.value.customDay))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۴. کنترل متدها </h3>`);
      _push(ssrRenderComponent(_component_PersianCalendar, {
        ref_key: "programmaticCalendar",
        ref: programmaticCalendar,
        onSelectDate: ($event) => handleCalendarDateChange("programmatic", $event)
      }, null, _parent));
      _push(`<div class="button-group" data-v-03901f9e><button class="prog-btn" data-v-03901f9e> امروز </button><button class="prog-btn" data-v-03901f9e> فردا </button><button class="prog-btn" data-v-03901f9e> هفته بعد </button><button class="prog-btn" data-v-03901f9e> ماه بعد </button></div>`);
      if (calendarDates.value.programmatic) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e> تاریخ فعلی: </strong> ${ssrInterpolate(formatDate(calendarDates.value.programmatic))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><section class="tab-content" style="${ssrRenderStyle(activeTab.value === "slots" ? null : { display: "none" })}" data-v-03901f9e><h2 data-v-03901f9e> سفارشی‌سازی با Slots </h2><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۱. DatePicker با آیکون سفارشی </h3>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.customIcon,
        "onUpdate:modelValue": ($event) => dates.value.customIcon = $event
      }, {
        icon: withCtx(({ togglePopup }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="custom-icon" data-v-03901f9e${_scopeId}> 🗓️ </span>`);
          } else {
            return [
              createVNode("span", {
                class: "custom-icon",
                onClick: togglePopup
              }, " 🗓️ ", 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (dates.value.customIcon) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e> تاریخ انتخابی: </strong> ${ssrInterpolate(formatDate(dates.value.customIcon))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۲. فیلد ورودی سفارشی </h3>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.customInput,
        "onUpdate:modelValue": ($event) => dates.value.customInput = $event
      }, {
        "input-field": withCtx(({ displayValue, togglePopup }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="custom-input-btn" data-v-03901f9e${_scopeId}> 📅 ${ssrInterpolate(displayValue || "انتخاب تاریخ")}</button>`);
          } else {
            return [
              createVNode("button", {
                onClick: togglePopup,
                class: "custom-input-btn"
              }, " 📅 " + toDisplayString(displayValue || "انتخاب تاریخ"), 9, ["onClick"])
            ];
          }
        }),
        icon: withCtx(({ togglePopup }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-03901f9e${_scopeId}></span>`);
          } else {
            return [
              createVNode("span")
            ];
          }
        }),
        "clear-button": withCtx(({}, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-03901f9e${_scopeId}></span>`);
          } else {
            return [
              createVNode("span")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (dates.value.customInput) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e>تاریخ انتخابی:</strong> ${ssrInterpolate(formatDate(dates.value.customInput))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۳. سلول روز سفارشی </h3>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.customDayCell,
        "onUpdate:modelValue": ($event) => dates.value.customDayCell = $event
      }, {
        "day-cell": withCtx(({ day }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="fancy-day-cell" data-v-03901f9e${_scopeId}><span class="day-number" data-v-03901f9e${_scopeId}>${ssrInterpolate(day.display)}</span>`);
            if (day.isToday) {
              _push2(`<span class="today-indicator" data-v-03901f9e${_scopeId}> ● </span>`);
            } else {
              _push2(`<!---->`);
            }
            if (day.isFriday) {
              _push2(`<span class="friday-indicator" data-v-03901f9e${_scopeId}> جمعه </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "fancy-day-cell" }, [
                createVNode("span", { class: "day-number" }, toDisplayString(day.display), 1),
                day.isToday ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "today-indicator"
                }, " ● ")) : createCommentVNode("", true),
                day.isFriday ? (openBlock(), createBlock("span", {
                  key: 1,
                  class: "friday-indicator"
                }, " جمعه ")) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (dates.value.customDayCell) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e> تاریخ انتخابی: </strong> ${ssrInterpolate(formatDate(dates.value.customDayCell))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۴. دکمه‌های سریع سفارشی </h3>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.customActions,
        "onUpdate:modelValue": ($event) => dates.value.customActions = $event,
        ref_key: "customActionsPicker",
        ref: customActionsPicker
      }, {
        "quick-actions": withCtx(({ selectToday, closePopup }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="custom-quick-actions" data-v-03901f9e${_scopeId}><button class="action-btn primary" data-v-03901f9e${_scopeId}> امروز </button><button class="action-btn" data-v-03901f9e${_scopeId}> دیروز </button><button class="action-btn danger" data-v-03901f9e${_scopeId}> بستن </button></div>`);
          } else {
            return [
              createVNode("div", { class: "custom-quick-actions" }, [
                createVNode("button", {
                  onClick: selectToday,
                  class: "action-btn primary"
                }, " امروز ", 8, ["onClick"]),
                createVNode("button", {
                  onClick: selectYesterday,
                  class: "action-btn"
                }, " دیروز "),
                createVNode("button", {
                  onClick: closePopup,
                  class: "action-btn danger"
                }, " بستن ", 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (dates.value.customActions) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e> تاریخ انتخابی: </strong> ${ssrInterpolate(formatDate(dates.value.customActions))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۵. هدر سفارشی </h3>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.customHeader,
        "onUpdate:modelValue": ($event) => dates.value.customHeader = $event
      }, {
        "popup-header": withCtx(({ currentYear, currentMonth, handleNextMonth, handlePrevMonth, handleNextYear, handlePrevYear, persianMonthName: persianMonthName2 }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="fancy-header" data-v-03901f9e${_scopeId}><div class="nav-section" data-v-03901f9e${_scopeId}><button class="fancy-btn" data-v-03901f9e${_scopeId}> ⏩ </button><button class="fancy-btn" data-v-03901f9e${_scopeId}> ▶ </button></div><div class="date-display" data-v-03901f9e${_scopeId}><h3 data-v-03901f9e${_scopeId}>${ssrInterpolate(persianMonthName2(currentMonth))}</h3><span class="year-badge" data-v-03901f9e${_scopeId}>${ssrInterpolate(currentYear)}</span></div><div class="nav-section" data-v-03901f9e${_scopeId}><button class="fancy-btn" data-v-03901f9e${_scopeId}> ◀ </button><button class="fancy-btn" data-v-03901f9e${_scopeId}> ⏪ </button></div></div>`);
          } else {
            return [
              createVNode("div", { class: "fancy-header" }, [
                createVNode("div", { class: "nav-section" }, [
                  createVNode("button", {
                    onClick: handlePrevYear,
                    class: "fancy-btn"
                  }, " ⏩ ", 8, ["onClick"]),
                  createVNode("button", {
                    onClick: handlePrevMonth,
                    class: "fancy-btn"
                  }, " ▶ ", 8, ["onClick"])
                ]),
                createVNode("div", { class: "date-display" }, [
                  createVNode("h3", null, toDisplayString(persianMonthName2(currentMonth)), 1),
                  createVNode("span", { class: "year-badge" }, toDisplayString(currentYear), 1)
                ]),
                createVNode("div", { class: "nav-section" }, [
                  createVNode("button", {
                    onClick: handleNextMonth,
                    class: "fancy-btn"
                  }, " ◀ ", 8, ["onClick"]),
                  createVNode("button", {
                    onClick: handleNextYear,
                    class: "fancy-btn"
                  }, " ⏪ ", 8, ["onClick"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (dates.value.customHeader) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e> تاریخ انتخابی: </strong> ${ssrInterpolate(formatDate(dates.value.customHeader))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> ۶. فوتر سفارشی </h3>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: dates.value.customFooter,
        "onUpdate:modelValue": ($event) => dates.value.customFooter = $event
      }, {
        "popup-footer": withCtx(({ formattedSelectedDate }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="custom-footer" data-v-03901f9e${_scopeId}><div class="footer-content" data-v-03901f9e${_scopeId}><span class="footer-label" data-v-03901f9e${_scopeId}> تاریخ انتخابی: </span><span class="footer-value" data-v-03901f9e${_scopeId}>${ssrInterpolate(formattedSelectedDate || "هیچ تاریخی انتخاب نشده")}</span></div><button class="footer-btn" data-v-03901f9e${_scopeId}> ذخیره تاریخ </button></div>`);
          } else {
            return [
              createVNode("div", { class: "custom-footer" }, [
                createVNode("div", { class: "footer-content" }, [
                  createVNode("span", { class: "footer-label" }, " تاریخ انتخابی: "),
                  createVNode("span", { class: "footer-value" }, toDisplayString(formattedSelectedDate || "هیچ تاریخی انتخاب نشده"), 1)
                ]),
                createVNode("button", {
                  onClick: handleFooterAction,
                  class: "footer-btn"
                }, " ذخیره تاریخ ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (dates.value.customFooter) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e> تاریخ انتخابی: </strong> ${ssrInterpolate(formatDate(dates.value.customFooter))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><section class="tab-content" style="${ssrRenderStyle(activeTab.value === "api" ? null : { display: "none" })}" data-v-03901f9e><h2 data-v-03901f9e> کاربردها </h2><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> استفاده از Composable </h3><div class="code-example" data-v-03901f9e><pre data-v-03901f9e>                            <code data-v-03901f9e>
const {
    today,
    persianMonthName,
    hijriMonthName,
    gregorianMonthName,
    jalaliToGregorian,
    jalaliToHijri,
    getDayEvents
} = usePersianCalendar()
                            </code>
                        </pre></div><div class="api-demo" data-v-03901f9e><div class="api-item" data-v-03901f9e><strong data-v-03901f9e> today: </strong><span class="api-value" data-v-03901f9e>${ssrInterpolate(JSON.stringify(unref(today)))}</span></div><div class="api-item" data-v-03901f9e><strong data-v-03901f9e> persianMonthName(7): </strong><span class="api-value" data-v-03901f9e>${ssrInterpolate(unref(persianMonthName)(7))}</span></div><div class="api-item" data-v-03901f9e><strong data-v-03901f9e> hijriMonthName(1): </strong><span class="api-value" data-v-03901f9e>${ssrInterpolate(unref(hijriMonthName)(1))}</span></div><div class="api-item" data-v-03901f9e><strong data-v-03901f9e> gregorianMonthName(10): </strong><span class="api-value" data-v-03901f9e>${ssrInterpolate(unref(gregorianMonthName)(10))}</span></div></div></div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> تبدیل تاریخ </h3><div class="converter" data-v-03901f9e><div class="converter-inputs" data-v-03901f9e><input${ssrRenderAttr("value", convertYear.value)} type="number" placeholder="سال" data-v-03901f9e><input${ssrRenderAttr("value", convertMonth.value)} type="number" placeholder="ماه" min="1" max="12" data-v-03901f9e><input${ssrRenderAttr("value", convertDay.value)} type="number" placeholder="روز" min="1" max="31" data-v-03901f9e><button class="convert-btn" data-v-03901f9e>تبدیل</button></div>`);
      if (convertedDates.value) {
        _push(`<div class="converter-results" data-v-03901f9e><div class="convert-result" data-v-03901f9e><strong data-v-03901f9e> میلادی: </strong><span data-v-03901f9e>${ssrInterpolate(convertedDates.value.gregorian.join("/"))}</span></div><div class="convert-result" data-v-03901f9e><strong data-v-03901f9e> هجری قمری: </strong><span data-v-03901f9e>${ssrInterpolate(convertedDates.value.hijri.join("/"))}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="example-card" data-v-03901f9e><h3 data-v-03901f9e> کنترل برنامه‌نویسی </h3>`);
      _push(ssrRenderComponent(_component_PersianDatePicker, {
        modelValue: programmaticDate.value,
        "onUpdate:modelValue": ($event) => programmaticDate.value = $event,
        ref_key: "programmaticPicker",
        ref: programmaticPicker
      }, null, _parent));
      _push(`<div class="button-group" data-v-03901f9e><button class="prog-btn" data-v-03901f9e> امروز </button><button class="prog-btn" data-v-03901f9e> فردا </button><button class="prog-btn" data-v-03901f9e> هفته بعد </button><button class="prog-btn" data-v-03901f9e> ماه بعد </button><button class="prog-btn danger" data-v-03901f9e> پاک کردن </button></div>`);
      if (programmaticDate.value) {
        _push(`<div class="result" data-v-03901f9e><strong data-v-03901f9e> تاریخ فعلی: </strong> ${ssrInterpolate(formatDate(programmaticDate.value))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-03901f9e"]]);
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-DgrngT1q.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-HwvuZQzk.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp$1();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, useNuxtApp$1 as a, useRuntimeConfig$1 as b, nuxtLinkDefaults as c, entry$1 as default, navigateTo as n, resolveRouteObject as r, tryUseNuxtApp$1 as t, useRouter as u };
//# sourceMappingURL=server.mjs.map
