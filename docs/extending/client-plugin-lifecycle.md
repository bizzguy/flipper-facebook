---
id: client-plugin-lifecycle
title: Client Plugin Lifecycle
---

There are two types of client plugin: Regular and Background plugins. We recommend starting off as a regular plugin and switching it to a background plugin if necessary.

For both types of plugin, we recommend starting work after `onConnect` is called, and terminating it after `onDisconnect`, when possible. This prevents wasted computation when Flipper isn't connected. If the plugin needs to keep track of events that occur before it gets connected (such as initial network requests on app startup), you should do so in the plugin constructor (or ideally in a separate class).

## Regular Plugin Lifecycle
For regular plugins, `onConnect` and `onDisconnect` are triggered when the user opens the plugin in the Flipper UI, and when they switch to another plugin, respectively.
![Regular Plugin Lifecycle diagram](/docs/assets/regular-plugin-lifecycle.png)

## Background Plugin Lifecycle
For background plugins, `onConnect` is called when Flipper first connects, and `onDisconnect` when it disconnects. The user does not need to be viewing the plugin for it to send messages; they will be queued up until the next time the user opens the plugin where they will be processed.

Even for background plugins, `onDisconnect` and `onConnect` may be called on a plugin (e.g. if the user restarts Flipper). Plugins should handle this accordingly by making sure to resend any important data to the reconnected instance.
<div class="warning">
Note that a plugin must be enabled by the user for its messages to be queued up.
</div>

![Background Plugin Lifecycle diagram](/docs/assets/bg-plugin-lifecycle.png)

