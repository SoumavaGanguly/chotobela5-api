import { useState } from "react";
import API from "../services/api";

export default function RSVPForm({ text }) {
  const [form, setForm] = useState({
    guest_name: "",
    mobile: "",
    adults: 1,
    kids: 0,
    food_preference: "Veg",
    note: "",
  });

  const submit = async () => {
    await API.post("/rsvp", form);
    alert(text.thankYou);
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl mb-4">{text.rsvpTitle}</h3>

      <input
        className="border p-2 block w-full mb-3"
        placeholder={text.name}
        onChange={(e) =>
          setForm({ ...form, guest_name: e.target.value })
        }
      />

      <input
        className="border p-2 block w-full mb-3"
        placeholder={text.mobile}
        onChange={(e) =>
          setForm({ ...form, mobile: e.target.value })
        }
      />

      <button
        onClick={submit}
        className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
      >
        {text.submit}
      </button>
    </div>
  );
}