"use client";
import { useState } from "react";

const SupplierForm = () => {
  const [validationMessages, setValidationMessages] = useState({
    supplier_name: "\u00A0",
    supplier_contact_person: "\u00A0",
    supplier_contact_number: "\u00A0",
    supplier_email_address: "\u00A0",
  });

  const [loading, setLoading] = useState(false);
  const validateForm = (formdata) => {
    const messages = {
      supplier_name: formdata.get("supplier_name").trim()
        ? "\u00A0"
        : "Supplier name is required.",
      supplier_contact_person: formdata.get("supplier_contact_person").trim()
        ? "\u00A0"
        : "Contact person is required.",
      supplier_contact_number: formdata.get("supplier_contact_number").trim()
        ? "\u00A0"
        : "Contact number is required.",
      supplier_email_address: /\S+@\S+\.\S+/.test(
        formdata.get("supplier_email_address")
      )
        ? "\u00A0"
        : "Valid email address is required.",
    };

    setValidationMessages(messages);

    Object.keys(messages).forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        if (messages[id] !== "\u00A0") {
          input.classList.add("border-red-500");
          input.classList.remove("border-gray-300");
        } else {
          input.classList.remove("border-red-500");
          input.classList.add("border-gray-300");
        }
      }
    });

    return Object.values(messages).every((msg) => msg === "\u00A0");
  };

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);

    if (!validateForm(formdata)) {
      return;
    }

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
      className="flex flex-col w-full h-fit py-2"
    >
      <label htmlFor="supplier_name">
        Supplier Name<span className="text-red-500 text-sm">*</span>
      </label>
      <input
        type="text"
        id="supplier_name"
        name="supplier_name"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
      />
      <p className="text-red-500 text-sm mb-2">
        {validationMessages.supplier_name}
      </p>

      <label htmlFor="supplier_contact_person">
        Contact Person<span className="text-red-500 text-sm">*</span>
      </label>
      <input
        type="text"
        id="supplier_contact_person"
        name="supplier_contact_person"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
      />
      <p className="text-red-500 text-sm mb-2">
        {validationMessages.supplier_contact_person}
      </p>

      <label htmlFor="supplier_contact_number">
        Contact<span className="text-red-500 text-sm">*</span>
      </label>
      <input
        type="text"
        id="supplier_contact_number"
        name="supplier_contact_number"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
      />
      <p className="text-red-500 text-sm mb-2">
        {validationMessages.supplier_contact_number}
      </p>

      <label htmlFor="supplier_email_address">
        Email Address<span className="text-red-500 text-sm">*</span>
      </label>
      <input
        type="email"
        id="supplier_email_address"
        name="supplier_email_address"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
      />
      <p className="text-red-500 text-sm mb-2">
        {validationMessages.supplier_email_address}
      </p>

      <label htmlFor="supplier_notes">Supplier Notes</label>
      <textarea
        id="supplier_notes"
        name="supplier_notes"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300 mb-2"
      />

      <div className="w-full flex flex-row-reverse">
        <button
          type="submit"
          className={` text-white rounded-lg p-2 w-fit flex-end 
          ${
            loading
              ? "cursor-not-allowed bg-mainButtonColorDisabled"
              : "cursor-pointer bg-mainButtonColor"
          }
            `}
        >
          {loading ? "Creating..." : "Create Supplier"}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;
