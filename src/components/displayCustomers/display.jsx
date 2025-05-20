import React, { useState } from "react";

export default function DisplayBookings({
  teams,
  refreshTeams,
  onUpdateBooking,
  onDeleteBooking,
  onDeleteTeam,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBooking, setEditingBooking] = useState(null); // { teamName, index } or null
  const [bookingForm, setBookingForm] = useState({
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

  if (!teams) return <p>Loading teams...</p>;

  const filteredTeams = teams.filter(
    (team) =>
      team.teamName &&
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditBookingClick = (teamName, booking, index) => {
    setEditingBooking({ teamName, index });
    setBookingForm({ ...booking });
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: ["entryFee", "winning", "casterCost", "productionCost"].includes(
        name
      )
        ? Number(value)
        : value,
    }));
  };

  const handleSaveBooking = () => {
    if (!editingBooking) return;
    onUpdateBooking(editingBooking.teamName, editingBooking.index, bookingForm);
    setEditingBooking(null);
  };

  const handleDeleteBooking = (teamName, index) => {
    if (
      window.confirm(
        `Are you sure you want to delete booking #${
          index + 1
        } from team "${teamName}"?`
      )
    ) {
      onDeleteBooking(teamName, index);
    }
  };

  // Totals calculation (grand)
  const grandTotals = filteredTeams.reduce(
    (totals, team) => {
      team.bookings.forEach((b) => {
        totals.entryFee += b.entryFee || 0;
        totals.winning += b.winning || 0;
        totals.casterCost += b.casterCost || 0;
        totals.productionCost += b.productionCost || 0;
      });
      return totals;
    },
    {
      entryFee: 0,
      winning: 0,
      casterCost: 0,
      productionCost: 0,
    }
  );

  const thTdStyleLeft = {
    padding: "8px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  };
  const thTdStyleRight = {
    padding: "8px",
    textAlign: "right",
    borderBottom: "1px solid #ddd",
  };

  return (
    <div className=" mt-[300px]">
      <h2>Team Bookings Overview</h2>

      <input
        type="text"
        placeholder="Search teams by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          marginBottom: "20px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      {/* Grand Totals Summary */}
      <div
        style={{
          marginBottom: "30px",
          padding: "16px",
          backgroundColor: "#e3f2fd",
          borderRadius: "6px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <span>Total Entry Fee: Rs {Math.round(grandTotals.entryFee)}</span>
          <span>Total Winning: Rs {Math.round(grandTotals.winning)}</span>
          <span>
            Total Caster Cost: Rs {Math.round(grandTotals.casterCost)}
          </span>
          <span>
            Total Production Cost: Rs {Math.round(grandTotals.productionCost)}
          </span>
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        filteredTeams.map((team) => {
          const totalEntryFee = team.bookings.reduce(
            (sum, b) => sum + (b.entryFee || 0),
            0
          );
          const totalWinning = team.bookings.reduce(
            (sum, b) => sum + (b.winning || 0),
            0
          );
          const totalCasterCost = team.bookings.reduce(
            (sum, b) => sum + (b.casterCost || 0),
            0
          );
          const totalProductionCost = team.bookings.reduce(
            (sum, b) => sum + (b.productionCost || 0),
            0
          );

          const totalTeamAmount = totalEntryFee - totalWinning;
          const totalNetAmount =
            totalEntryFee -
            totalWinning -
            totalProductionCost -
            totalCasterCost;

          return (
            <div key={team._id} style={{ marginBottom: "60px" }}>
              <h3
                style={{ marginBottom: "12px" }}
                className="text-[40px] font-bold text-red-600 text-center"
              >
                TEAM - {team.teamName}
                <button
                  style={{
                    marginLeft: "20px",
                    padding: "6px 12px",
                    backgroundColor: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                  onClick={() => onDeleteTeam(team.teamName)}
                >
                  Delete Team
                </button>
              </h3>

              {team.bookings.length === 0 ? (
                <p>No bookings available.</p>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    marginBottom: "8px",
                  }}
                >
                  <thead style={{ backgroundColor: "#1976d2", color: "white" }}>
                    <tr>
                      <th style={{ padding: "10px", textAlign: "left" }}>
                        Date
                      </th>
                      <th style={{ padding: "10px", textAlign: "left" }}>
                        Time
                      </th>
                      <th style={{ padding: "10px", textAlign: "left" }}>
                        Server
                      </th>
                      <th style={{ padding: "10px", textAlign: "right" }}>
                        Entry Fee
                      </th>
                      <th style={{ padding: "10px", textAlign: "right" }}>
                        Winning
                      </th>
                      <th style={{ padding: "10px", textAlign: "left" }}>
                        Description
                      </th>
                      <th style={{ padding: "10px", textAlign: "left" }}>
                        Caster
                      </th>
                      <th style={{ padding: "10px", textAlign: "right" }}>
                        Caster Cost
                      </th>
                      <th style={{ padding: "10px", textAlign: "left" }}>
                        Production
                      </th>
                      <th style={{ padding: "10px", textAlign: "right" }}>
                        Production Cost
                      </th>
                      <th style={{ padding: "10px", textAlign: "center" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.bookings.map((b, index) => {
                      // If this booking is being edited, show input fields
                      if (
                        editingBooking &&
                        editingBooking.teamName === team.teamName &&
                        editingBooking.index === index
                      ) {
                        return (
                          <tr
                            key={index}
                            style={{ backgroundColor: "#ffffcc" }}
                          >
                            <td style={thTdStyleLeft}>
                              <input
                                type="text"
                                name="date"
                                value={bookingForm.date}
                                onChange={handleChange}
                                style={{ width: "100%" }}
                              />
                            </td>
                            <td style={thTdStyleLeft}>
                              <input
                                type="text"
                                name="time"
                                value={bookingForm.time}
                                onChange={handleChange}
                                style={{ width: "100%" }}
                              />
                            </td>
                            <td style={thTdStyleLeft}>
                              <input
                                type="text"
                                name="server"
                                value={bookingForm.server}
                                onChange={handleChange}
                                style={{ width: "100%" }}
                              />
                            </td>
                            <td style={thTdStyleRight}>
                              <input
                                type="number"
                                name="entryFee"
                                value={bookingForm.entryFee}
                                onChange={handleChange}
                                style={{ width: "100%" }}
                                min="0"
                              />
                            </td>
                            <td style={thTdStyleRight}>
                              <input
                                type="number"
                                name="winning"
                                value={bookingForm.winning}
                                onChange={handleChange}
                                style={{ width: "100%" }}
                                min="0"
                              />
                            </td>
                            <td style={thTdStyleLeft}>
                              <input
                                type="text"
                                name="discription"
                                value={bookingForm.discription}
                                onChange={handleChange}
                                style={{ width: "100%" }}
                              />
                            </td>
                            <td style={thTdStyleLeft}>
                              <input
                                type="text"
                                name="caster"
                                value={bookingForm.caster}
                                onChange={handleChange}
                                style={{ width: "100%" }}
                              />
                            </td>
                            <td style={thTdStyleRight}>
                              <input
                                type="number"
                                name="casterCost"
                                value={bookingForm.casterCost}
                                onChange={handleChange}
                                style={{ width: "100%" }}
                                min="0"
                              />
                            </td>
                            <td style={thTdStyleLeft}>
                              <input
                                type="text"
                                name="production"
                                value={bookingForm.production}
                                onChange={handleChange}
                                style={{ width: "100%" }}
                              />
                            </td>
                            <td style={thTdStyleRight}>
                              <input
                                type="number"
                                name="productionCost"
                                value={bookingForm.productionCost}
                                onChange={handleChange}
                                style={{ width: "100%" }}
                                min="0"
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <button
                                style={{
                                  marginRight: "6px",
                                  padding: "4px 8px",
                                  backgroundColor: "#4caf50",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                                onClick={handleSaveBooking}
                              >
                                Save
                              </button>
                              <button
                                style={{
                                  padding: "4px 8px",
                                  backgroundColor: "#f44336",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        );
                      }

                      // Otherwise show regular row
                      return (
                        <tr
                          key={index}
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#f9f9f9" : "white",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          <td style={thTdStyleLeft}>{b.date}</td>
                          <td style={thTdStyleLeft}>{b.time}</td>
                          <td style={thTdStyleLeft}>{b.server}</td>
                          <td style={thTdStyleRight}>
                            Rs {Math.round(b.entryFee)}
                          </td>
                          <td style={thTdStyleRight}>
                            Rs {Math.round(b.winning)}
                          </td>
                          <td style={thTdStyleLeft}>{b.discription}</td>
                          <td style={thTdStyleLeft}>{b.caster}</td>
                          <td style={thTdStyleRight}>
                            Rs {Math.round(b.casterCost)}
                          </td>
                          <td style={thTdStyleLeft}>{b.production}</td>
                          <td style={thTdStyleRight}>
                            Rs {Math.round(b.productionCost)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              style={{
                                marginRight: "6px",
                                padding: "4px 8px",
                                backgroundColor: "#4caf50",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleEditBookingClick(team.teamName, b, index)
                              }
                            >
                              Update
                            </button>
                            <button
                              style={{
                                padding: "4px 8px",
                                backgroundColor: "#f44336",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleDeleteBooking(team.teamName, index)
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot
                    style={{
                      backgroundColor: "#e3f2fd",
                      fontWeight: "bold",
                      borderTop: "2px solid #1976d2",
                    }}
                  >
                    <tr>
                      <td
                        colSpan={3}
                        style={{ padding: "8px", textAlign: "right" }}
                      >
                        Totals:
                      </td>
                      <td style={thTdStyleRight}>
                        Rs {Math.round(totalEntryFee)}
                      </td>
                      <td style={thTdStyleRight}>
                        Rs {Math.round(totalWinning)}
                      </td>
                      <td></td>
                      <td></td>
                      <td style={thTdStyleRight}>
                        Rs {Math.round(totalCasterCost)}
                      </td>
                      <td></td>
                      <td style={thTdStyleRight}>
                        Rs {Math.round(totalProductionCost)}
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td
                        colSpan={11}
                        style={{ borderTop: "2px solid #1976d2", padding: 0 }}
                      ></td>
                    </tr>

                    <tr
                      style={{ backgroundColor: "#bbdefb", fontWeight: "bold" }}
                    >
                      <td
                        colSpan={10}
                        style={{ padding: "8px", textAlign: "left" }}
                      >
                        Total Team Amount (Entry Fee - Winning):
                      </td>
                      <td className="relative left-[-1300px] text-white bg-red-600 w-[160px] text-center">
                        Rs {Math.round(totalTeamAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
