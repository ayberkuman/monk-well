import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";

import { Helmet } from "react-helmet-async";
import { SimpleList } from "../utils/components/SimpleList";
import { MonkButton } from "../utils/components/MonkButton";
import API, { headers } from "../utils/API";
import { authRoutes } from "../App/routes";
import { CSSTransition } from "react-transition-group";
import Modal from "../utils/components/Modal";
import { toArray } from "lodash";
//import AddAppointment from "./components/AddAppointment";

export default class Calendar extends Component {
  state = {
    choosenDoctor: "",
    events: [],
    doctors: [],
    popup: {
      isOn: false,
      coordinates: { x: "", y: "" },
      content: "",
    },
    isAddModalOn: false,
  };

  addModalNodeRef = React.createRef();
  id = this.props.match.params.id;
  componentDidMount = () => this.getReservations();

  componentDidUpdate = (prevProps) => {
    if (prevProps.id !== this.props.id) this.getReservations();
  };
  hashCode = (str) => {
    let sliced = str.slice(0, 6);
    return sliced;
  };

  getReservations = () => {
    API.get(`/api/Reservation/List?length=999&clinicId=${2}`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${this.props.user.token}`,
      },
    })
      .then((res) => {
        const { data } = res.data;
        console.log(data);
        const doctorsArr = [];
        const d1 = new Date();
        let currrent = new Date(
          d1.getFullYear(),
          d1.getMonth() + 1,
          d1.getDay(),
          d1.getHours()
        );
        /* const filtered = [];
        data.forEach((e) => {
          let date = e.date;
          let year = Number(date.slice(0, 4));
          let month = Number(date.slice(5, 7));
          let day = Number(date.slice(8, 10));
          let hour = Number(date.slice(11, 13));
          let appointmentDate = new Date(year, month, day, hour);
          if (appointmentDate < currrent || e.statusStr === "Passive") {
            return null;
          } else {
            filtered.push(e);
          }
        }); */
        data.forEach(({ doctor }) => {
          const params = {
            id: doctor.user.id,
            name: `${doctor.user.firstName} ${doctor.user.lastName}`,
            color: `#${this.hashCode(String(doctor.user.id))}`,
          };
          doctorsArr.push(params);
        });
        const events = data.map((event) => {
          let color = "";
          doctorsArr.forEach((doctor) => {
            if (doctor.id === event.doctor.user.id) {
              color = doctor.color;
              return true;
            }
            return false;
          });
          return {
            doctor: event.doctor.user.id,
            id: event.id,
            date: event.date.slice(0, 16),
            title: `${event.user.user.firstName} ${event.user.user.lastName}`,
            description: event.description,
            color,
            /* url: auth.editPatientAppointment.links[this.props.lang]
              .replace(":id", event.user.id)
              .replace(":appointment", event.id), */
          };
        });
        let doctors = doctorsArr.filter(
          (thing, index, self) =>
            index === self.findIndex((t) => t.id === thing.id)
        );
        this.setState({ doctors, events });
      })
      .catch((err) => console.log(err));
  };

  popupTimeout = "";
  showPopup = (info) => {
    clearTimeout(this.popupTimeout);
    const { el, event } = info;
    const { x, y } = el.getBoundingClientRect();
    const coordinates = { x, y };
    const content = event.extendedProps.description;
    this.setState({
      popup: { ...this.state.popup, isOn: true, content, coordinates },
    });
  };

  hidePopup = () =>
    (this.popupTimeout = setTimeout(
      () =>
        this.setState(
          {
            popup: { ...this.state.popup, isOn: false },
          },
          () => {
            setTimeout(
              () =>
                this.setState({
                  popup: {
                    ...this.state.popup,
                    coordinates: { x: "", y: "" },
                    content: "",
                  },
                }),
              210
            );
            clearTimeout(this.popupTimeout);
          }
        ),
      800
    ));
  filterPatient = (doctorId) => {
    const filteredArr = this.state.events.filter((e) => e.doctor === doctorId);
    this.setState({ filteredArr, choosenDoctor: doctorId });
  };
  clearList = () => {
    this.setState({ choosenDoctor: "" });
  };

  render() {
    return (
      <div className="Calendar">
        <Helmet title={this.props.translate("calendar")} />
        <div className="container-fluid">
          <div className="row">
            <div className="col-3">
              <SimpleList
                translate={this.props.translate}
                listItems={this.state.doctors.map((doctor) => (
                  <div
                    onClick={() => this.filterPatient(doctor.id)}
                    className="doctor-holder position-absolute d-flex w-100 h-100"
                  >
                    <div
                      className="background position-absolute w-100 h-100"
                      style={{ backgroundColor: doctor.color }}
                    ></div>
                    <p>{doctor.name}</p>
                  </div>
                ))}
                clearList={this.clearList}
                id="doctors-list"
                title={this.props.translate("calendar.doc")}
              />
            </div>
            <div className="col-9">
              <div className="row">
                <div className="col-6 col-lg-4 col-xl-3">
                  <MonkButton
                    className="add-appointment-link"
                    onClick={() => this.setState({ isAddModalOn: true })}
                  >
                    {this.props.translate("calendar.new_appointment")}
                  </MonkButton>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, momentPlugin]}
                    initialView="dayGridMonth"
                    events={
                      this.state.choosenDoctor
                        ? this.state.filteredArr
                        : this.state.events
                    }
                    locale={this.props.lang}
                    eventMouseEnter={this.showPopup}
                    eventMouseLeave={this.hidePopup}
                    eventClick={(info) => {
                      info.jsEvent.preventDefault();
                      this.props.history.push(info.event.url);
                    }}
                    eventTimeFormat={{
                      omitZeroMinute: false,
                      hour12: false,
                      hour: "numeric",

                      minute: "2-digit",
                      meridiem: false,
                    }}
                    eventDisplay="block"
                    headerToolbar={{
                      start: "title",
                      center: "prev,next",
                      end: "today dayGridMonth,dayGridWeek,timeGridDay",
                    }}
                    buttonText={{
                      today: this.props.translate("calendar.today"),
                      month: this.props.translate("calendar.month"),
                      week: this.props.translate("calendar.week"),
                      day: this.props.translate("calendar.day"),
                    }}
                    height="78vh"
                    navLinks={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="event-popup position-fixed"
          style={{
            left: this.state.popup.coordinates.x,
            top: this.state.popup.coordinates.y,
          }}
          data-is-active={this.state.popup.isOn}
        >
          {this.state.popup.content}
        </div>
        <CSSTransition
          in={this.state.isAddModalOn}
          timeout={300}
          unmountOnExit
          nodeRef={this.addModalNodeRef}
          classNames="Modal"
        >
          <Modal
            closeModal={() => this.setState({ isAddModalOn: false })}
            modalRef={this.addModalNodeRef}
            title="Randevu Ekle"
            noOverflow
          >
            {/* <AddAppointment
              translate={this.props.translate}
              user={this.props.user}
              closeModal={() => this.setState({ isAddModalOn: false })}
              updateAppointments={this.getReservations}
            /> */}
          </Modal>
        </CSSTransition>
      </div>
    );
  }
}
