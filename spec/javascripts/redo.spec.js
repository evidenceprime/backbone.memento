describe("redo", function(){
  beforeEach(function(){
    this.model = new AModel();
  });

  describe("when undoing, then redoing the last unstored change", function(){
    beforeEach(function(){
      this.model.set({foo: "bar"});
      this.model.store();
      this.model.set({foo: "what?"});
      this.model.restore();
    });

    it("should reset the model to the last change", function(){
      expect(this.model.get("foo")).toBe("bar");
      this.model.redo();
      expect(this.model.get("foo")).toBe("what?");
    });
  });

  describe("when redoing and no more mementos exist", function(){
    beforeEach(function(){
      this.model.set({foo: "bar"});
      this.model.redo();
    });

    it("should not redo anything", function(){
      expect(this.model.get("foo")).toBe("bar");
    });
  });

  describe("when undoing once and redoing twice", function(){
    beforeEach(function(){
      this.model.set({foo: "bar"});
      this.model.store();
      this.model.set({foo: "what?"});
      this.model.restore();
    });

    it("should not restore anything past the first one", function(){
      expect(this.model.get("foo")).toBe("bar");
      this.model.redo();
      expect(this.model.get("foo")).toBe("what?");
      this.model.redo();
      expect(this.model.get("foo")).toBe("what?");
    });
  });

  describe("when undoing twice and redoing twice", function(){
    beforeEach(function(){
      this.model.set({foo: "bar"});
      this.model.store();
      this.model.set({foo: "i dont know"});
      this.model.store();
      this.model.set({foo: "third"});
      this.model.restore();
    });

    it("should reapply the last change", function(){
      expect(this.model.get("foo")).toBe("i dont know");
      this.model.restore();
      expect(this.model.get("foo")).toBe("bar");
      this.model.redo();
      expect(this.model.get("foo")).toBe("i dont know");
      this.model.redo();
      expect(this.model.get("foo")).toBe("third");
    });
  });

  describe("when adding a new attributes, undoing, then redoing", function(){
    beforeEach(function(){
      this.model.set({foo: "bar"});
      this.model.store();
      this.model.set({bar: "baz"});
      this.model.restore();
    });

    it("should readd the new attribute", function(){
      expect(this.model.get("bar")).toBeUndefined();
      this.model.redo();
      expect(this.model.get("bar")).toBe("baz");
    });
  });
});
