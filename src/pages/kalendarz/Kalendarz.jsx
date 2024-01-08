import React from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

const localizer = momentLocalizer(moment); // or globalizeLocalizer
function Event({event}) {
  return (
    <span>
      <strong>{event.title}</strong>
      {event.numer_ewidencyjny && <span>Nr działki: {event.numer_ewidencyjny}</span>}
      {event.operator && <span> - {event.operator}</span>}
      {event.opis && (
        <div>
          <em>{event.opis}</em>
        </div>
      )}
    </span>
  );
}

function Kalendarz() {
  const [myEventsList, setMyEventsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };
  useEffect(() => {
    fetch("/api/kalendarz", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item) => {
          return {
            ...item,
            start: new Date(item.start),
            end: new Date(item.end),
          };
        });
        setMyEventsList(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/kalendarz/${eventId}`, {
        method: "DELETE", // or the correct method according to your API
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error deleting event");

      // Filter out the deleted event from the state
      setMyEventsList(myEventsList.filter((event) => event.id !== eventId));
      // Close the modal if it's open
      setShowModal(false);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };
  function EventModal({event, onClose}) {
    if (!event) return null;
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-10">
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{event.title}</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-gray-500">Data rozpoczęcia: {event.start.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Data zakończenia: {event.end.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Numer ewidencyjny: {event.numer_ewidencyjny}</p>
              <p className="text-sm text-gray-500">Operator: {event.operator}</p>
              <p className="text-sm text-gray-500">Opis: {event.opis}</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <Link to={`/edytuj-kalendarz/${event.kalendarz_id}`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Edytuj</button>
              </Link>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => handleDeleteEvent(event.kalendarz_id)}>
                Usuń
              </button>
              <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={onClose}>
                Zamknij
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col justify-start p-10">
        <div className="flex flex-row justify-between">
          <h1 className="text-base font-bold opacity-80">Kalendarz</h1>
          <Link to="/dodaj-kalendarz" className="mx-2 my-2">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Dodaj</button>
          </Link>
        </div>
        <div className="h-[750px] w-[1500px]">
          <Calendar
            localizer={localizer}
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            views={["month", "week", "day", "agenda"]}
            components={{
              event: Event,
            }}
            onSelectEvent={handleEventClick}
          />
          {showModal && <EventModal event={selectedEvent} onClose={() => setShowModal(false)} />}
        </div>
      </div>
    </div>
  );
}

export default Kalendarz;
