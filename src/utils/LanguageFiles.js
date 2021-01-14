import React, { Component } from "react";
import { withLocalize } from "react-localize-redux";

import lngEN from "./i18n/en/en.json";
import lngTR from "./i18n/tr/tr.json";

class LanguageFiles extends Component {
  constructor(props) {
    super(props);

    this.props.addTranslationForLanguage(lngEN, "en");
    this.props.addTranslationForLanguage(lngTR, "tr");
  }
  render() {
    return <></>;
  }
}

export default withLocalize(LanguageFiles);
