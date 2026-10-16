/** Expected, user-explainable failures from content operations. */
export class ContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentError";
  }
}

/** Someone else saved a newer version of the item since this form was opened. */
export class ConflictError extends ContentError {
  constructor() {
    super("Someone else changed this item while you were editing it. Reload the page to see their version, then make your change again.");
    this.name = "ConflictError";
  }
}
