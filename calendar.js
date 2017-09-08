class Calendar {
  constructor(container) {
    const date = new Date();
    this.props = {
      fullYear: true,
      months: null,
      ommitWeekDays: null,
      highlights: null,
      weekDaysAbr: false,
      weekdayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      weekdayNamesAbr: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      wrapperElement: {
        element: "table",
        class: null
      },
      rowElement: {
        element: "tr",
        class: null
      },
      weekDayCellElement: {
        element: "td",
        class: null
      },
      monthDayCellElement: {
        element: "td",
        class: null
      },
      emptyCell: {
        content: null,
        class: null
      },
      containerElement: container,
      year: date.getFullYear(),
      errors: ['Calendar Error: You must specify a container for the Calendar, example: new Container(document.getElementById("someElementId"))',
        'Calendar Error: The element you specified as the container could not be found, please double check the containerElement property',
        'Calendar Error: At least one month must be specified, if you want all months within a year, you can specify fullYear:true, to specify anything less, use months:[0,1,2...], the order in which you specify the array will decide the order of renderization, the months start at 0 for January to 11 for December'
      ]
    }
  }

  setYear(year) {
    this.props.year = year;
  }

  appendCalendarTo(elem) {
    elem.append(this.props.calendar);
  }

  getMonthDays(month) {
    return new Date(this.props.year, month, 0).getDate();
  }

  monthStartAtWeekDay(month) {
    return new Date(this.props.year, month, 1).getDay();
  }

  weekDayName(weekDayNumber) {
    if (this.props.weekDaysAbr === true) {
      return this.props.weekdayNamesAbr[weekDayNumber];
    }
    return this.props.weekdayNames[weekDayNumber];
  }

  excludeWeekDay(wd) {
    return (this.props.ommitWeekDays != null && this.props.ommitWeekDays.includes(wd)) ? this.props.ommitWeekDays : false;
  }

  getWeekLabelRow() {
    const weekLabelRow = this.createElement(this.props.rowElement);
    for (let wd = 0; wd <= 6; wd++) {
      if (this.excludeWeekDay(wd)) {
        continue;
      }
      const weekLabelCell = this.createElement(this.props.weekDayCellElement);
      weekLabelCell.innerHTML = this.weekDayName(wd);
      weekLabelRow.append(weekLabelCell);
    }
    return weekLabelRow;
  }

  getMonthDaysRows(m) {
    const cmd = this.getMonthDays(m + 1),
      wds = this.monthStartAtWeekDay(m);
    let md = 0,
      r = [];
    for (let mr = 0; mr <= 5; mr++) {
      let mdr = this.createElement(this.props.rowElement);
      let cc;
      for (let wd = 0; wd <= 6; wd++) {
        let mdce = this.createElement(this.props.monthDayCellElement);
        cc = this.props.emptyCell.content;

        if (md < cmd && (md > 0 || wd == wds)) {
          md++;
          cc = md;
        }

        if (cc == this.props.emptyCell.content && this.props.emptyCell.class != null) {
          mdce.className = this.props.emptyCell.class;
        }

        if (this.excludeWeekDay(wd)) {
          continue;
        }

        let highLightClass = this.isDayHighLighted(md, m, cc);
        if (highLightClass != false) {
          mdce.className += " " + highLightClass;
        }



        mdce.innerHTML = cc;
        mdr.append(mdce);
      }

      r.push(mdr);

      if (md == cmd && mr == 4) {
        break;
      }
    }
    return r;
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  isDayHighLighted(md, m, cc) {
    if (this.props.tempHighLights != null && cc != this.props.emptyCellContent) {

      if (typeof this.props.tempHighLights[m] == "undefined") {
        if (this.isEmpty(this.props.tempHighLights)) {
          delete this.props["tempHighLights"];
        }
        return false;
      }

      let tempHighLights = this.props.tempHighLights[m],
        highLightArray = tempHighLights.d,
        highLightClass = tempHighLights.c;

      for (let i = 0; i < highLightArray.length; i++) {
        if (md == highLightArray[i]) {
          highLightArray.splice(i, 1);
          if (highLightArray.length === 0) {
            delete this.props.tempHighLights[m];
          }
          return highLightClass;
        }
      }
    } else {
      return false;
    }
  }


  createElement(calendarElementObj) {
    const e = document.createElement(calendarElementObj.element);
    if (calendarElementObj.class != null) {
      e.className = calendarElementObj.class;
    }
    return e;
  }

  createCalendarHTML() {
    if (typeof this.props.containerElement == "undefined") {
      console.log(this.props.errors[0]);
      return;
    }
    if (this.props.containerElement == null) {
      console.log(this.props.errors[1]);
      return;
    }

    let wrapper = this.createElement(this.props.wrapperElement);

    this.props.tempHighLights = Object.assign({}, this.props.highlights);

    if (this.props.fullYear === true && this.props.months === null) {
      for (let month = 0; month <= 11; month++) {
        wrapper.append(this.getWeekLabelRow());
        let rows = this.getMonthDaysRows(month);
        for (let i = 0; i < rows.length; i++) {
          wrapper.append(rows[i]);
        }
      }
    } else {
      if (this.props.months === null) {
        console.log(this.props.errors[2]);
        return;
      }
      for (let month = 0; month < this.props.months.length; month++) {
        wrapper.append(this.getWeekLabelRow());
        let rows = this.getMonthDaysRows(this.props.months[month]);
        for (let i = 0; i < rows.length; i++) {
          wrapper.append(rows[i]);
        }
      }
    }
    this.props.containerElement.append(wrapper);
  }
}

const calendar = new Calendar(document.getElementById("calendar"));
calendar.props.wrapperElement.class = "table--calendar";
calendar.props.weekDayCellElement.class = "td--week-day";
calendar.props.monthDayCellElement.class = "td--month-day";
calendar.props.emptyCell.class = "td--empty-cell";
calendar.props = {
  ...calendar.props,
    weekDaysAbr: true,
    months: [0],
    highlights: {
      0: {
        "d": [1],
        "c": "blueBg"
      },
      1: {
        "d": [2, 3],
        "c": "blueBg"
      },
      2: {
        "d": [1, 3],
        "c": "grayBg"
      }
    }
};

calendar.createCalendarHTML();
