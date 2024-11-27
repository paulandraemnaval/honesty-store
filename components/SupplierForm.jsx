"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import closeIcon from "@public/icons/close_icon.png";
import { toast } from "react-hot-toast";
import ButtonLoading from "./ButtonLoading";
import Loading from "./Loading";
const SupplierForm = ({ setShowSupplierForm, supplierID = "" }) => {
  const [validationMessages, setValidationMessages] = useState({
    supplier_name: "\u00A0",
    supplier_contact_person: "\u00A0",
    supplier_contact_number: "\u00A0",
    supplier_email_address: "\u00A0",
  });
  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  const getSupplier = async () => {
    try {
      setDataLoading(true);
      const response = await fetch(`/api/admin/supplier/${supplierID}`);
      const data = await response.json();
      setSupplier(data ? data?.data : null);
    } catch (err) {
      console.error("Failed to fetch supplier:", err);
      setSupplier(null);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (!supplierID) return;
    getSupplier();
  }, [supplierID]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    if (!validateForm(formdata)) return;

    if (supplierID) {
      patchSupplier(e);
    } else {
      postSupplier(e);
    }
  };

  const postSupplier = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/admin/supplier", {
        method: "POST",
        body: new FormData(e.target),
      });
      const data = await response.json();
      if (data?.success) {
        toast.success("Supplier has been created successfully!", {
          duration: 3000,
          style: { fontSize: "1.2rem", padding: "16px" },
        });
        e.target.reset();
        setSupplier(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Failed to create supplier:", err);
      toast.error("Failed to create supplier. Please try again later.", {
        duration: 3000,
        style: { fontSize: "1.2rem", padding: "16px" },
      });
    } finally {
      setLoading(false);
    }
  };

  const patchSupplier = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/supplier/${supplierID}`, {
        method: "PATCH",
        body: new FormData(e.target),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Supplier has been updated successfully!", {
          duration: 3000,
          style: { fontSize: "1.2rem", padding: "16px" },
        });
      } else {
        toast.error("Failed to update supplier. Please try again later.", {
          duration: 3000,
          style: { fontSize: "1.2rem", padding: "16px" },
        });
      }
    } catch (err) {
      console.error("Failed to update supplier:", err);
      toast.error("Failed to update supplier. Please try again later.", {
        duration: 3000,
        style: { fontSize: "1.2rem", padding: "16px" },
      });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full sm:flex hidden px-2 mb-2 py-2">
        <div className="w-full">
          <h1 className="text-2xl font-bold mr-auto">Make new supplier</h1>
          <h2 className="text-sm text-gray-500">
            Make a new supplier for inventories
          </h2>
        </div>
        <div
          className="w-fit h-fit cursor-pointer "
          onClick={() => setShowSupplierForm(false)}
        >
          <Image
            src={closeIcon}
            alt="close icon"
            width={30}
            height={30}
            className="self-end"
          />
        </div>
      </div>

      <form
        action="createSupplier"
        onSubmit={handleSubmit}
        className="flex flex-col w-full h-fit py-1 px-1"
      >
        <label htmlFor="supplier_name">
          Supplier Name<span className="text-red-500 text-sm">*</span>
        </label>
        <input
          type="text"
          id="supplier_name"
          name="supplier_name"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
          value={supplier?.supplier_name || ""}
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
          value={supplier?.supplier_contact_person || ""}
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
          value={supplier?.supplier_contact_number || ""}
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
          value={supplier?.supplier_email_address || ""}
        />
        <p className="text-red-500 text-sm mb-2">
          {validationMessages.supplier_email_address}
        </p>

        <label htmlFor="supplier_notes">Supplier Notes</label>
        <textarea
          id="supplier_notes"
          name="supplier_notes"
          className="h-40 px-2 py-4 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300 mb-4"
          value={supplier?.supplier_notes || ""}
        />

        <div className="w-full flex flex-row-reverse">
          <button
            type="submit"
            className={` text-white rounded-lg p-2 w-fit flex-end ${
              loading
                ? "cursor-not-allowed bg-mainButtonColorDisabled"
                : "cursor-pointer bg-mainButtonColor"
            }`}
            disabled={loading}
          >
            {loading ? (
              <ButtonLoading>Processing...</ButtonLoading>
            ) : supplierID ? (
              "Update Supplier"
            ) : (
              "Create Supplier"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default SupplierForm;
