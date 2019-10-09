<a href="https://launchlet.dev"><img src="https://launchlet.dev/logo.svg" width="64"></a>

# Launchlet Browser Extension

As a complement to the [main project](https://github.com/launchlet/launchlet), this browser extension adds the following extra functionality to Launchlet:

- Run Recipes automatically on page load
- Run Recipes via keyboard shortcuts
- Customize keyboard shortcuts

# Setup

There are two parts to running the extension: *Install* in the browser, and then *Pair* with the [Composer](https://launchlet.dev/compose). 

## Install

### Firefox

https://addons.mozilla.org/addon/launchlet/

### Chrome

### Safari

## Pair

1) Click the *Generate Key* button in the extension context menu and then copy the key
2) Click the *Pair extension* button in the Composer and enter the key

If successfully paired, the extension context menu should display a settings button and the Composer should not have any messages.

If not successful, the extension context menu will continue to show the key and the Composer might say 'Waiting' or 'Failed'.

After pairing, all changes should transfer to the extension automatically.

# Keyboard Shortcuts

It is possible to run the version of Launchlet built in the Composer using the keyboard shortcut `Alt+Shift+1`. This shortcut is customizable from the extension Settings page.

There are two parts to a shortcut: the key combination and the *Signature*.

## Key combination

The key combination is specified using either the `code` or `key` from [JavaScript Keyboard events](https://keycode.info).

To simplify writing this out, in the extension Settings page there is a simulation that prints out the corresponding format for any shortcut — copy/paste this to specify the key combination.

## Signature

The extension makes it possible to set shortcuts using the *Signature* for any *Recipe* saved in the Composer.

For example, by default there is a shortcut of `Alt+Shift+2` for the signature 'XYZAlfa' - this means that a *Recipe* with the *Signature* 'XYZAlfa' should run with the key combination `Alt+Shift+2` – replace 'XYZAlfa' with the *Signature* from your own *Recipe* to customize the shortcut.
