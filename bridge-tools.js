/* Recursively crawls through all components of the specified applet, and
 * returns basic information about them.
 *
 * c
 *   Applet to crawl through. Has to be a reference to DOM applet or object
 *   element.
 * returns
 *   A string containing information about all components in the specified
 *   applet. Each line contains information about one component: path to the
 *   element, its class name, its value and its text (if applicable).
 */
function appletCrawler(c) {
  var report = "";

  // Returns report entry for a given component.
  function format(c, padding) {
    var name = c.getName();
    var type = c.getClass().getSimpleName();
    var text = "";
    try { text = " = \""+ c.getText() + "\""; } catch (err) { }
    return padding +": "+ "["+ type + "] "+ name + text + "\n";
  }

  // Does the actual crawling.
  function crawl(c, padding) {
    report += format(c, padding);

    var children = null;
    try { children = c.getComponents() } catch (err) { }
    for (var n = 0; children != null && children[n] != null; n++) {
      crawl(c.getComponent(n), padding + n + ".");
    }
  }

  crawl(c, "");
  return report;
}





/* Returns class names for all ancestors (supers) of the specified component.
 *
 * target
 *   Component for which to return parent class names. Has to be a reference to
 *   a component inside a java applet.
 * returns
 *   A string containing names for all superclasses, one per line.
 */
function superChain(target) {
  var report = "";

  for (t = target.getClass(); t != null; t = t.getSuperclass())
    report += t.getCanonicalName() + "\n";

  return report;
}





/* Finds a component by its path.
 *
 * c
 *   Applet within which to search. Has to be a reference to DOM applet or
 *   object element.
 * path
 *   A component path (as returned by appletCrawler)
 *   Format:
 *     "a.b.c.d.", where a, b, c and d are numbers representing indexes in the
 *     component children array.
 *     "0.6.2." would reference third child of a seventh child of a first child
 *     of the root node (the applet itself).
 * returns
 *   A reference to the found component.
 */
function findComponent(c, path) {
  var dotPos = path.indexOf(".", 0);

  if (dotPos == -1) {
    return c;
  } else {
    var componentIndex = path.substring(0, dotPos);
    var child = c.getComponent(componentIndex);
    var pathTail = path.substring(dotPos+1);
    return findComponent(child, pathTail);
  }
}





/* Enters given text into the specified component.
 * More precisely, it sends a series of java.awt.event.KeyEvent.KEY_TYPED events
 * to the component.
 * Note: it will append the text.
 *
 * c
 *   Applet containing the target component. Has to be a reference to DOM applet
 *   or object element.
 * target
 *   Component to which to send the text.
 * text
 *   The text to send.
 * returns
 *   undefined.
 */
function typeText(c, target, text) {
  var KE = c.Packages.java.awt.event.KeyEvent;
  var id = KE.KEY_TYPED;
  var when = c.Packages.java.lang.System.currentTimeMillis();
  var mod = 0;
  var code = KE.VK_UNDEFINED;

  for (var i = text.length-1; i >= 0; i--) {
    var e = new KE(target, id, when, 0, code, text[i].charCodeAt());
    c.dispatchEvent(e);
  }
}
