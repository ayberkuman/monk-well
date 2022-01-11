import React, { Component } from "react";
import API, { headers } from "../../utils/API";
//import { MonkButton } from "../../utils/components/MonkButton";
//import MonkInput from "../../utils/components/MonkInput";
//import MonkSelect from "../../utils/components/MonkSelect";
import { SuggestionItem } from "../../utils/components/SuggestionItem";
//import { handleErrors } from "../../utils/helper";
import toastr from "toastr";
import moment from "moment";

export default class AddAppointment extends Component {
  state = {
    patient: { id: "", name: "" },
    patients: [],
    date: null,
    doctor: { id: "", name: "" },
    doctors: [],
    hour: "",
    appointment: "",
  };

  componentDidMount = () => {
    this.handleGetDoctor();
    const localPatient = localStorage.getItem("patient");
    if (localPatient) {
      this.setState({ patient: localPatient }, () =>
        localStorage.removeItem("patient")
      );
    } else
      API.get(`Account/GetById?id=${this.id}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.props.user.token}`,
        },
      }).then((res) => {
        const { data } = res;

        const patient = `${data.user.firstName} ${data.user.lastName}`;

        this.setState({ patient });
      });
    this.handleGetPatient();
  };

  handleChange = ({ target }) => this.setState({ [target.name]: target.value });

  searchDoctorTimeout = "";
  handleSearchDoctor = ({ target }) => {
    clearTimeout(this.searchDoctorTimeout);

    this.setState(
      { doctor: { ...this.state.doctor, name: target.value } },
      () => {
        if (this.state.doctor.name) {
          this.searchDoctorTimeout = setTimeout(this.handleGetDoctor, 550);
        } else {
          this.setState({ doctors: [] });
        }
      }
    );
  };

  handleGetDoctor = () => {
    API.get(
      `Account/ListAllDoctors?clinicId=${this.props.user.clinic.id}&searchBy=${this.state.doctor.name}`,
      {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.props.user.token}`,
        },
      }
    )
      .then((res) => {
        const { data } = res.data;

        const doctors = data
          .sort((a, b) => a.user.firstName - b.user.firstName)
          .map((doctor) => ({
            id: doctor.user.id,
            name: `${doctor.user.firstName} ${doctor.user.lastName}`,
          }));

        this.setState({ doctors });
      })
      .catch((err) => console.log(err));
  };

  searchPatientTimeout = "";
  handleSearchPatient = ({ target }) => {
    clearTimeout(this.searchPatientTimeout);

    this.setState(
      { patient: { ...this.state.patient, name: target.value } },
      () => {
        if (this.state.patient.name) {
          this.searchPatientTimeout = setTimeout(this.handleGetPatient, null);
        } else {
          this.setState({ patients: [] });
        }
      }
    );
  };

  handleGetPatient = () => {
    API.get(
      `Account/ListAllPassions?clinicId=${this.props.user.clinic.id}&searchBy=${this.state.patient.name}`,
      {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.props.user.token}`,
        },
      }
    )
      .then((res) => {
        const { data } = res.data;

        const patients = data
          .sort((a, b) => a.user.firstName - b.user.firstName)
          .map((patient) => ({
            id: patient.user.id,
            name: `${patient.user.firstName} ${patient.user.lastName}`,
          }));

        this.setState({ patients });
      })
      .catch((err) => console.log(err));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.date !== null && this.state.hour.length !== 0) {
      const date = moment(this.state.date);
      date.set("hour", parseInt(this.state.hour));

      const data = {
        userId: this.state.patient.id,
        doctorId: this.state.doctor.id,
        clinicId: this.props.user.clinic.id,
        description: this.state.appointment,
        date,
        status: 10,
      };

      API.post("Reservation", data, {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.props.user.token}`,
        },
      })
        .then((res) => {
          toastr.clear();
          toastr.success(this.props.translate("created"));
          this.props.updateAppointments();
          this.props.closeModal();
        })
        .catch((err) => console.log(err));
    } else {
      toastr.error(this.props.translate("calendar.error"));
    }
  };

  render() {
    return (
      <div className="patient-details-page add-appointment-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-6 col-lg-6">
              <div className="row">
                <div className="col-12">
                  {/* <MonkInput
                    autoComplete="off"
                    name="patient"
                    label={this.props.translate("add_patient.patient")}
                    value={this.state.patient.name}
                    placeholder={`Hasta Seçiniz`}
                    onChange={this.handleSearchPatient}
                    suggestions={this.state.patients.map((data) => (
                      <SuggestionItem
                        key={data.id}
                        onClick={() => {
                          this.setState({
                            patient: { id: data.id, name: data.name },
                            patients: [],
                          });
                        }}
                      >
                        {data.name}
                      </SuggestionItem>
                    ))}
                  /> */}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  {/*  <MonkInput
                    type="date"
                    name="date"
                    label="Tarih"
                    placeholder="Tarih Seçin"
                    minDate={new Date()}
                    onChange={(date) => this.setState({ date })}
                    value={this.state.date}
                    dateFormat="dd MMMM yyyy"
                  /> */}
                </div>
              </div>
            </div>
            <div className="col-6 col-lg-6">
              <div className="row">
                <div className="col-12">
                  {/*  <MonkInput
                    autoComplete="off"
                    name="doctor"
                    label={`Doktor`}
                    placeholder={`Doktor Seçiniz`}
                    value={this.state.doctor.name}
                    onChange={this.handleSearchDoctor}
                    suggestions={this.state.doctors.map((data) => (
                      <SuggestionItem
                        key={data.id}
                        onClick={() => {
                          this.setState({
                            doctor: { id: data.id, name: data.name },
                            doctors: [],
                          });
                        }}
                      >
                        {data.name}
                      </SuggestionItem>
                    ))}
                  /> */}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  {/* <MonkSelect
                    name="hour"
                    label={`Saat`}
                    placeholder={`Saat Seçiniz`}
                    value={this.state.hour}
                    onChange={this.handleChange}
                    options={Array.from({ length: 24 }, (_, i) => ({
                      value: `${i < 10 ? `0` : ``}${i}:00`,
                      title: `${i < 10 ? `0` : ``}${i}:00`,
                    }))}
                  /> */}
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row">
                {/* <div className="col-6">
                  <MonkInput
                    autoComplete="off"
                    name="appointment"
                    value={this.state.appointment}
                    label={`Randevu`}
                    placeholder={`Randevu`}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-6">
                  <MonkButton className="w-100" onClick={this.handleSubmit}>
                    Onayla
                  </MonkButton>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
