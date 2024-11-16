"use client";
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
      className="flex flex-col w-full gap-2 h-fit py-2"
    >
      <label htmlFor="supplier_name">Supplier Name</label>
      <input
        type="text"
        id="supplier_name"
        name="supplier_name"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        required
      />
      <label htmlFor="supplier_contact_person">Contact Person</label>
      <input
        type="text"
        id="supplier_contact_person"
        name="supplier_contact_person"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        required
      />
      <label htmlFor="supplier_contact_number">Contact</label>
      <input
        type="text"
        id="supplier_contact_number"
        name="supplier_contact_number"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        required
      />
      <label htmlFor="supplier_email_address">Email Address</label>
      <input
        type="email"
        id="supplier_email_address"
        name="supplier_email_address"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        required
      />
      <label htmlFor="supplier_notes">Supplier Notes</label>
      <textarea
        id="supplier_notes"
        name="supplier_notes"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
      />
      <div className="w-full flex flex-row-reverse">
        <button
          type="submit"
          className="bg-customerRibbonGreen text-white rounded-lg p-2 w-fit flex-end bg-mainButtonColor"
        >
          Create Supplier
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;
