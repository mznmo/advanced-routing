import { Link, useRouteLoaderData, redirect, Await } from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";
import { Suspense } from "react";

export default function EventsDetails() {
  const { event, events } = useRouteLoaderData("event-detail");

  return (
    <>
      <h1>Events Details Page</h1>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
      <Link to=".." relative="path">
        Back to Events
      </Link>
    </>
  );
}

async function loadEvent(id) {
  console.log("fetching event");
  const response = await fetch("http://localhost:8080/events/" + id);

  if (!response.ok) {
    console.log("failed event");

    throw new Response(
      JSON.stringify({ message: "Could not load details of event" }),
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData.event;
  }
}

async function loadEvents() {
  console.log("fetching events");

  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    console.log("failed events");

    throw new Response(JSON.stringify({ message: "Could not fetch events" }), {
      status: 500,
    });
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

export async function loader({ request, params }) {
  const id = params.id;

  return {
    event: await loadEvent(id),
    events: loadEvents(),
  };
}

export async function action({ params, request }) {
  console.log("DELETE action triggered for ID:", params.id);

  const id = params.id;
  const response = await fetch("http://localhost:8080/events/" + id, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not delete event" }), {
      status: 500,
    });
  }

  return redirect("/events");
}
