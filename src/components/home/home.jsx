import React, { useEffect, useState } from "react";
import axios from "axios";
import Display from "../displayCustomers/display";

export default function TeamSelector() {
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [message, setMessage] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [showAll, setShowAll] = useState(false); // NEW: toggle all

  const [booking, setBooking] = useState({
    customerName: "",
    date: "",
    time: "",
    server: "",
    entryFee: 0,
    winning: 0,
    discription: "",
    caster: "",
    casterCost: 0,
    production: "",
    productionCost: 0,
  });

  // Fetch teams
  const fetchTeams = async () => {
    try {
      const res = await axios.get(
        "https://hisab-backend-hu8f.onrender.com/api/bookingData"
      );
      setTeams(res.data);
    } catch {
      setMessage("Failed to load teams");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCheckboxChange = (teamName) => {
    setSelectedTeams((prev) =>
      prev.includes(teamName)
        ? prev.filter((t) => t !== teamName)
        : [...prev, teamName]
    );
  };

  const handleUpdateBooking = async (
    teamName,
    bookingIndex,
    updatedBooking
  ) => {
    try {
      await axios.put(
        `https://hisab-backend-hu8f.onrender.com/api/bookingData/${teamName}/bookings/${bookingIndex}`,
        updatedBooking
      );
      setMessage("Booking updated successfully");
      await fetchTeams();
    } catch (error) {
      setMessage("Failed to update booking: " + error.message);
    }
  };

  const handleDeleteBooking = async (teamName, bookingIndex) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      await axios.delete(
        `https://hisab-backend-hu8f.onrender.com/api/bookingData/${teamName}/bookings/${bookingIndex}`
      );
      setMessage("Booking deleted successfully");
      await fetchTeams();
    } catch (error) {
      setMessage("Failed to delete booking: " + error.message);
    }
  };

  const handleDeleteTeam = async (teamName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete team "${teamName}" and all its bookings?`
      )
    )
      return;

    try {
      await axios.delete(
        `https://hisab-backend-hu8f.onrender.com/api/bookingData/${teamName}`
      );
      setMessage(`Team "${teamName}" deleted successfully.`);
      await fetchTeams();
      // Also remove from selectedTeams if selected
      setSelectedTeams((prev) => prev.filter((t) => t !== teamName));
    } catch (error) {
      setMessage("Failed to delete team: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setBooking((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleAddTeam = async () => {
    if (!newTeamName.trim()) {
      setMessage("Team name cannot be empty.");
      return;
    }
    try {
      const res = await axios.post(
        "https://hisab-backend-hu8f.onrender.com/api/bookingData",
        {
          teamName: newTeamName,
          bookings: [],
        }
      );
      setTeams((prev) => [...prev, res.data]);
      setMessage(`Team "${res.data.teamName}" created.`);
      setNewTeamName("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error creating team. Try again."
      );
    }
  };

  const handleAddBooking = async () => {
    if (selectedTeams.length === 0) {
      setMessage("Please select at least one team to add booking.");
      return;
    }
    try {
      await Promise.all(
        selectedTeams.map((teamName) =>
          axios.post(
            `https://hisab-backend-hu8f.onrender.com/api/bookingData/${teamName}/bookings`,
            booking
          )
        )
      );
      setMessage("Booking added successfully to selected teams!");
      setBooking({
        customerName: "",
        date: "",
        time: "",
        server: "",
        entryFee: 0,
        winning: 0,
        discription: "",
        caster: "",
        casterCost: 0,
        production: "",
        productionCost: 0,
      });
      setSelectedTeams([]); // ✅ Clear selected checkboxes
      await fetchTeams();
    } catch (error) {
      setMessage("Error adding booking: " + error.message);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowAll((prev) => !prev)}
        className="bg-black text-white p-[10px] ml-[100px]  mt-[10px]"
        style={{ padding: "10px", width: "15%", marginBottom: 20 }}
      >
        {showAll ? "Hide Team Management" : "Show Team Management"}
      </button>

      {showAll && (
        <>
          <div className="font-[500]">
            <h2 className="relative left-[100px]">Add New Team</h2>

            <div
              style={{ display: "flex", marginBottom: 16 }}
              className="relative left-[100px]"
            >
              <input
                type="text"
                placeholder="New team name"
                className="border-[2px] border-black "
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              <button
                onClick={handleAddTeam}
                className="bg-black text-white p-[10px] ml-[20px] "
              >
                Add Team
              </button>
            </div>

            <h2 className="relative left-[100px]">Select Teams</h2>
            {message && <p className="relative left-[100px]">{message}</p>}
            {teams.length === 0 && !message && <p>Loading teams...</p>}
            <form className="relative left-[100px]">
              {teams.map(({ teamName, _id }) => (
                <div key={_id} style={{ marginBottom: 8 }}>
                  <label>
                    <input
                      type="checkbox"
                      value={teamName}
                      checked={selectedTeams.includes(teamName)}
                      onChange={() => handleCheckboxChange(teamName)}
                    />
                    {" " + teamName}
                  </label>
                </div>
              ))}
            </form>

            <div className="relative left-[500px] top-[300px]">
              <h2
                className="text-xl font-bold mb-4"
                style={{ marginTop: -400 }}
              >
                Add Booking Entry
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddBooking();
                }}
                className="flex flex-col gap-3 items-start"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>DATE</label>
                    <input
                      className="border-2 border-black w-full p-2"
                      type="text"
                      name="date"
                      value={booking.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>TIME</label>
                    <input
                      className="border-2 border-black w-full p-2"
                      type="text"
                      name="time"
                      value={booking.time}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>SERVER</label>
                    <input
                      className="border-2 border-black w-full p-2"
                      type="text"
                      name="server"
                      placeholder="Server"
                      value={booking.server}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>ENTREE FEE</label>
                    <input
                      className="border-2 border-black w-full p-2"
                      type="number"
                      name="entryFee"
                      placeholder="Entry Fee"
                      value={booking.entryFee}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div>
                    <label>WINNING</label>
                    <input
                      className="border-2 border-black w-full p-2"
                      type="number"
                      name="winning"
                      placeholder="Winning"
                      value={booking.winning}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div>
                    <label>DISCRIPTION</label>
                    <input
                      className="border-2 border-black w-full p-2"
                      type="text"
                      name="discription"
                      placeholder="Description"
                      value={booking.discription}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>EVENT CASTER</label>
                    <input
                      className="border-2 border-black w-full p-2"
                      type="text"
                      name="caster"
                      placeholder="Caster"
                      value={booking.caster}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>CASTER AMOUNT</label>
                    <input
                      className="border-2 border-black w-full p-2"
                      type="number"
                      name="casterCost"
                      placeholder="Caster Cost"
                      value={booking.casterCost}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div>
                    <label>PRODUCTION</label>
                    <input
                      className="border-2 border-black w-full p-2"
                      type="text"
                      name="production"
                      placeholder="Production"
                      value={booking.production}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>PRODUCTION AMOUNT</label>
                    <input
                      className="border-2 border-black w-full p-2"
                      type="number"
                      name="productionCost"
                      placeholder="Production Cost"
                      value={booking.productionCost}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 w-[300px] mt-4 hover:bg-blue-700 transition"
                >
                  Add Booking to Selected Teams
                </button>
              </form>
            </div>

            <div
              className="left-[80px] relative text-red-500 font-bold top-[200px]"
              style={{ marginTop: 20 }}
            >
              <strong>Selected Teams:</strong>{" "}
              {selectedTeams.join(", ") || "None"}
            </div>
          </div>
        </>
      )}
      <Display
        teams={teams}
        onDeleteTeam={handleDeleteTeam}
        onUpdateBooking={handleUpdateBooking}
        onDeleteBooking={handleDeleteBooking}
      />
    </div>
  );
}
