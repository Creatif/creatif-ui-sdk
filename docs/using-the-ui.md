# Using the UI

UI is made to be intuitive but there are some features that are not clear right away. This section will
explain those features.

# Filtering

Filtering is pretty straightforward. Just press the _Filters_ button and a side screen will appear that lets
you filter by different fields.

![Using filters](_images/using_the_ui_filters.gif 'Using filters')

# Editing a structure entry

A structure entry can be edited in two ways. The first one is when you are in the listing screen.

![Editing an entry](_images/using_the_ui_editing.gif 'Editing an entry')

You can also go to the individual entry view and edit the item there. Every entry in the list has a set of icons
on the right side of each item. You can edit, change the locale, change groups, view the item and delete the item there.

![Using listing](_images/using_the_ui_listing.gif 'Editing listing')

# Indexes

You can change the order of entries by changing the _index_. Based on the _index_, you can ask the public API to list
the entries based on the current position in the listing. This is a simple drag and drop operation. When using the UI,
drag an item where you want it. Later on, you can choose to filter out the items based on the index. That way, you can
change the order of your items when using the public API. More on using he public API in the [Using API SDK section](using-api-sdk).

![Using indexes](_images/using_the_ui_index.gif 'Using indexes')

# Versions

When publishing, you publish you data as a version. You can have as many versions as you want but the name of a version
must be unique. After publishing the first version, this version is not enabled by default. You must enable it manually. After
you publish more version, you can enable any of them and previously enabled will be disabled by default. You cannot have more
than one version enabled at a time.

Changing data after publishing a version does not affect published API. The version is a snapshot of your data in the moment of
publishing.

You can access _publishing_ with the _Publish_ button in the upper right corner of your screen. This button is always present.

![Publish button](_images/tutorial_publish_button.png 'Publish button')
