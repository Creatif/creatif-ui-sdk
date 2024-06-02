# Concepts

Most of the concepts that I'm going to explain here and throughout this documentation
you already know from your everyday work as a software developer. You don't have to 
learn anything new. I am going to talk about lists, maps and forms. That's it. 
There are very few parts that are specific for this CMS but when they
come up, this documentation will highlight it and explain them well.

Creatif puts i18n to the front. Every entry and form that you are going to make has a locale
associated to it. The default locale is **eng** but you can change it to any locale you like.
We will talk about locales later on. 

There are two types of entries in Creatif. Those are **maps** and **lists**. Both of these
are similar to maps and lists in every programming language. Every map has a name and a locale
associated to it. Maps must have a unique name while lists must have a unique both name and
a locale. That is the only difference between them. Just like programming languages have
data structure, Creatifs data structure are maps and lists. From now on, this documentation
will refer to them as **structures**. 

Name of a map and a list is determined by the form you make. You can assign a name of a structure
programmatically or if you name a field in your form simply **name**. For example, if you
have a text input

````tsx
<InputText name="name" />
````

the name attribute of the form field is **name**. That will tell Creatif that this form
value is unique for a map or list (in case of the list, it does not have to be unique if
it is a different locale).

This is it. Best way to learn is by trying, so first, go to the [Get starter](installation) section
to set up Creatif and then, head to [Tutorial](tutorial) to learn everything there is about
Creatif. 