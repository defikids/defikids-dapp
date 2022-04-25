require("chai").use(require("chai-as-promised")).should();

const Host = artifacts.require("Host");

contract("Host", ([parent, child1, child2]) => {
  let host;

  beforeEach(async () => {
    host = await Host.new();
  });

  describe("deployment", () => {
    it("tracks the contract address", async () => {
      (await host.address).should.not.be.null;
    });
  });

  describe("Parent", () => {
    it("registers a new parent", async () => {
      await host.registerParent({ from: parent });
      const parentIndex = "1";
      const userType = await host.getUserType(parent);
      userType.toString().should.be.equal(parentIndex);
    });
    it("error if parent is already registered", async () => {
      await host.registerParent({ from: parent });
      await host
        .registerParent({ from: parent })
        .should.be.rejectedWith("You are already registered as a parent");
    });
  });

  describe("Child", () => {
    const username = "child1";

    beforeEach(async () => {
      await host.registerParent({ from: parent });
    });

    it("registers a new child", async () => {
      await host.addChild(child1, username, true, { from: parent });
      const childIndex = "2";
      const userType = await host.getUserType(child1);
      userType.toString().should.be.equal(childIndex);
    });

    it("error if child is already registered", async () => {
      await host.addChild(child1, username, true, { from: parent });
      await host
        .addChild(child1, username, true, { from: parent })
        .should.be.rejectedWith("Child is already registered to a family");
    });

    it("error if the user registering the child is not a parent", async () => {
      await host
        .addChild(child1, "child1", true, { from: child1 })
        .should.be.rejectedWith("Only a parent can make this request");
    });

    it("should return all children", async () => {
      await host.addChild(child1, username, true, { from: parent });
      await host.addChild(child2, username, true, { from: parent });
      const children = await host.fetchChildren({ from: parent });
      children.length.should.be.equal(2);
    });

    it("should error if a non-parent tries to fetch children", async () => {
      await host.addChild(child1, username, true, { from: parent });
      await host
        .fetchChildren({ from: child1 })
        .should.be.rejectedWith("Only a parent can make this request");
    });

    it("should return the correct child", async () => {
      await host.addChild(child1, username, true, { from: parent });
      const childProfile = await host.fetchChild(child1, { from: parent });
      childProfile._address.should.be.equal(child1);
    });

    it("should change the childs access status", async () => {
      await host.addChild(child1, username, true, { from: parent });
      const childProfileBefore = await host.fetchChild(child1, {
        from: parent,
      });
      const id = Number(childProfileBefore.childId);
      await host.changeAccess(child1, id, { from: parent });
      const childProfileAfter = await host.fetchChild(child1, { from: parent });
      childProfileAfter.isLocked.should.be.equal(false);
    });

    it("should error if a non-parent tries to change the access status", async () => {
      await host.addChild(child1, username, true, { from: parent });
      const childProfileBefore = await host.fetchChild(child1, {
        from: parent,
      });
      const id = Number(childProfileBefore.childId);
      await host
        .changeAccess(child1, id, { from: child1 })
        .should.be.rejectedWith("Only a parent can make this request");
    });
  });
});
