# Note
This is a fork of the original [repo](https://github.com/ronvanderheijden/vscode-phpdoc-generator) and contains features of this other [fork](https://github.com/Samuel-Hinchliffe/vscode-phpdoc-generator.git)

I added this new features :
  - Added support to add in @author as a signature for a class
  - Added an option to align the name of parameters of a method
# A quick note
This is a fork of the original repo. All this app does is a few little things ontop. See the [original](https://marketplace.visualstudio.com/items?itemName=ronvanderheijden.phpdoc-generator) app and also checkout the github [repo](https://github.com/ronvanderheijden/vscode-phpdoc-generator) too.

# What's new about this?
Now every function you generate can have a signature. You can have a @author signature for each function. You can @copyright for each function. Both with a @see signature so you can direct people towards a link. As well as having a snippet of code that will also display when the comment was generated.

![Screen Capture in Action](https://raw.githubusercontent.com/Samuel-Hinchliffe/vscode-phpdoc-generator/master/assets/example.png)
# PHPDoc Generator

PHPDoc Generator is [a VSCode extension](https://marketplace.visualstudio.com/items?itemName=ronvanderheijden.phpdoc-generator) that generates a PHP documentation block using a keyboard shortcut.

To get PHPDoc Generator to generate PHPDoc block, place the cursor on a line with a class, method or property and press <kbd>Control+Enter</kbd>.

![Screen Capture in Action](https://raw.githubusercontent.com/ronvanderheijden/vscode-phpdoc-generator/master/assets/screencast.gif)

If PHPDoc Generator is unable to accurately detect the data type it will use a general data type. In these situations remember to provide the data type yourself or correct it if it's not accurate.
<!--PHPDoc Generator can also update the PHPDoc blocks for you.-->

# Keyboard Shortcuts & Settings
Looking for the keyboard shotcuts and settings? Search for `phpdoc-generator`.

# Support
Found a bug? Got a feature request?  [Create an issue](https://github.com/ronvanderheijden/vscode-phpdoc-generator/issues).

# License
PHPDoc Generator is open source and licensed under [the MIT licence](https://github.com/ronvanderheijden/vscode-phpdoc-generator/blob/master/LICENSE.txt).
