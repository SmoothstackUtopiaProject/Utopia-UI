// Libraries
import React, { Component } from 'react';
import AirplanesDispatcher from '../../../dispatchers/AirplanesDispatcher';

// Components
import MSTitle from './MSTitle';
import PathIndicator from './PathIndicator';
import PopContent from '../../../components/PopContent_v0.0.1';
import StatusIndicator from './StatusIndicator';;

class AirplanesDashboard extends Component {
  constructor(props) {
    super(props)
    // @PROP: isActive - bool
    // @PROP: reduce - f()
    // @PROP: state - obj{}

    this.state = {
      onCancel: null,
      onConfirm: null,
      isActive_PopContent: false,
    };
  }

  render() {
    const { isActive, state } = this.props;
    const { sizing } = state;

    const buttonSize = sizing.button || 30;

    const searchResults = state.airplanes
    ? state.airplanes.searchResults
    : [];

    const status = state.airplanes
    ? state.airplanes.status
    : "UNKNOWN";

    return ( 
      <div
        className={"gradient-lightgrey90 rounded border-shadow flex-column"}
        style={{
          height: isActive ? "150px" : "75px", 
          width:"100%", 
          overflow:"hidden",
          marginBottom: buttonSize * 0.75 + "px"
        }}
      >
        {/* Header */}
        <div
          className={"flex-row-start"}
          style={{height: "40%", width:"100%"}}
        >
          {/* Title */}
          <div style={{marginLeft: buttonSize * 0.5 + "px"}}>
            <MSTitle
              buttonSize={buttonSize}
              isActive={isActive}
              text={"Airplane MS"}
            />
          </div>

          {/* Status Indicator */}
          <div style={{marginLeft:"auto", marginRight: buttonSize * 0.25 +"px"}}>
            <StatusIndicator 
              status={isActive ? "ACTIVE" : "INACTIVE"}
              size={buttonSize * 0.75}
            />
          </div>

          {/* URI Path Text */}
          <div style={{marginRight: buttonSize * 0.5 +"px"}}>
            <PathIndicator 
              location={"http://airplane-service"}
              size={buttonSize * 0.8}
            />
          </div>
        </div>

        {/* Divider */}
        {isActive &&
          <div 
            className={"gradient-smoke border-shadow flex-row-start"}
            style={{
              height:"5%",
              width:"100%"
            }}
          />
        }

        {/* Function Buttons */}
        {isActive &&
          <div
            className={"flex-row-start"}
            style={{
              height: "55%", 
              width:"95%",
              flexWrap: "wrap"
            }}
          >
            <button
              className={"btn bg-cream bg-yellow-hover rounded border-shadow border-shadow-hover flex-column"}
              style={{
                height: buttonSize + "px", 
                width: (buttonSize * 3.5) + "px",
              }}
              onClick={() => this.findAllAirplanes()}
            >
              {status === "PENDING" 
                ? <div
                    className="spinner-border kit-color-cream"
                    style={{
                      height: buttonSize * 0.5 + "px",
                      width: buttonSize * 0.5 + "px",
                    }}
                  />
                : "findAllAirplanes()"
              }
            </button>
          </div>
        }

      {/* Pop Content */}
      {this.state.isActive_PopContent &&
        <PopContent 
          buttonSize={buttonSize}
          elementHeight={window.innerHeight * 0.75}
          elementWidth={window.innerWidth * 0.9}
          elementOffsetX={(window.innerWidth - (window.innerWidth * 0.9)) * 0.5}
          elementOffsetY={(window.innerHeight - (window.innerHeight * 0.75)) * 0.5}
          onClose={() => this.setState({isActive_PopContent: false})}
          content={this.handleRenderAirplaneList(searchResults)}
        />
      }
      </div>
    );
  }

  findAllAirplanes = () => {
    const { reduce } = this.props;
    AirplanesDispatcher.onFindAll(reduce);
    this.setState({isActive_PopContent: true});
  }

  handleRenderAirplaneList = (airplanesList) => {
    let airplanesTable = [];
    for(var i in airplanesList) {
      airplanesTable.push(
        <div
          key={"airplane-" + airplanesList[i].iataId}
          className="bg-yellow rounded border-shadow flex-row-start m-1"
          style={{
            fontSize: "20px",
            height: "50px",
            width:"95%",
            paddingLeft: "10px"
          }}
        >
          <div
            className="bg-smoke rounded border-shadow flex-row"
            style={{width:"50px"}}
          >
            {airplanesList[i].iataId}
          </div>
          <div
            className="ml-auto mr-auto"
          >
            {airplanesList[i].city}
          </div>
        </div>
      );
    }
    return (
      <div
        className="bg-smoke rounded border-shadow flex-column-start"
        style={{
          height: "95%",
          width: "95%",
          flexWrap: "wrap",
          overflow: "auto"
        }}
      >
        {airplanesTable}
      </div>
    );
  };

}
export default AirplanesDashboard;