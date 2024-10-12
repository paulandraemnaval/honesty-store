import React from "react";

const SupplierForm = () => {
  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    try {
      const response = await fetch("/api/admin/supplier", {
        method: "POST",
        body: formdata,
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <form
      action="createSupplier"
      onSubmit={handleCreateSupplier}
      className="flex flex-col gap-4"
    >
      <label htmlFor="supplierName">Supplier Name</label>
      <input
        type="text"
        id="supplierName"
        name="supplierName"
        className="border"
      />
      <label htmlFor="supplierContactPerson">Contact Person</label>
      <input
        type="text"
        id="supplierContactPerson"
        name="supplierContactPerson"
        className="border"
      />
      <label htmlFor="supplierContactNumber">Contact</label>
      <input
        type="text"
        id="supplierContactNumber"
        name="supplierContactNumber"
        className="border"
      />
      <label htmlFor="supplierEmailAddress">Email Address</label>
      <input
        type="email"
        id="supplierEmailAddress"
        name="supplierEmailAddress"
        className="border"
      />
      <label htmlFor="supplierNotes">Supplier Notes</label>
      <textarea id="supplierNotes" name="supplierNotes" className="border" />
      <button
        type="submit"
        className="self-start bg-green-400 text-white p-4 rounded-md"
      >
        Add Supplier
      </button>
    </form>
  );
};

export default SupplierForm;
