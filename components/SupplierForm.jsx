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
      <label htmlFor="supplier_name">Supplier Name</label>
      <input
        type="text"
        id="supplier_name"
        name="supplier_name"
        className="border"
      />
      <label htmlFor="supplier_contact_person">Contact Person</label>
      <input
        type="text"
        id="supplier_contact_person"
        name="supplier_contact_person"
        className="border"
      />
      <label htmlFor="supplier_contact_number">Contact</label>
      <input
        type="text"
        id="supplier_contact_number"
        name="supplier_contact_number"
        className="border"
      />
      <label htmlFor="supplier_email_address">Email Address</label>
      <input
        type="email"
        id="supplier_email_address"
        name="supplier_email_address"
        className="border"
      />
      <label htmlFor="supplier_notes">Supplier Notes</label>
      <textarea id="supplier_notes" name="supplier_notes" className="border" />
      <button
        type="submit"
        className="self-start bg-customerRibbonGreen text-white p-4 rounded-md"
      >
        Add Supplier
      </button>
    </form>
  );
};

export default SupplierForm;
