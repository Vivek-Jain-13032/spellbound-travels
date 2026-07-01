/**
 * The Google Translate widget rewrites page text nodes directly in the DOM.
 * When Angular later tries to remove/insert a node inside that rewritten
 * subtree (e.g. an *ngIf toggling elsewhere), the browser throws
 * "NotFoundError: Failed to execute 'removeChild'/'insertBefore' on 'Node'"
 * because the node Angular expects is no longer where it left it. This is a
 * well-documented conflict between Google Translate and any DOM-diffing SPA
 * framework — the standard fix is to make these two calls defensive.
 */
export function patchDomForGoogleTranslate(): void {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}
