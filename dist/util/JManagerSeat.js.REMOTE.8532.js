'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _parseInt = require('babel-runtime/core-js/number/parse-int');

var _parseInt2 = _interopRequireDefault(_parseInt);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _JNetworkCinema = require('../network/JNetworkCinema.js');

var _JNetworkCinema2 = _interopRequireDefault(_JNetworkCinema);

var _JToolString = require('../tool/JToolString.js');

var _JToolString2 = _interopRequireDefault(_JToolString);

var _AutoSeatPicking = require('../arithmetic/AutoSeatPicking');

var _AutoSeatPicking2 = _interopRequireDefault(_AutoSeatPicking);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _cellSize = 30;
var _cellRowSpace = 8;
var _cellColSpace = 8;

var instance = null;

var SeatManager = function () {
  function SeatManager() {
    (0, _classCallCheck3.default)(this, SeatManager);

    if (!instance) {
      instance = this;
    }
    return instance;
  }

  (0, _createClass3.default)(SeatManager, [{
    key: 'smartSeatsFromSeats',
    value: function smartSeatsFromSeats(type, seatData) {
      var seatList = this.unitySeatWithSeatData(type, seatData);

      return this.smartSeatsWithSeats(type, seatList);
    }
  }, {
    key: 'smartSeatDataFromSmartSeats',
    value: function smartSeatDataFromSmartSeats(type, smartSeats) {
      var seatRowData = this.rowDataFromSmartSeats(smartSeats);
      var seatContentData = this.seatContentDataFromSmartSeats(smartSeats);
      return (0, _extends3.default)({ smartSeats: smartSeats, seatRowData: seatRowData }, seatContentData);
    }
  }, {
    key: 'smartSeatDataFromSeats',
    value: function smartSeatDataFromSeats(type, seatData) {
      var smartSeats = this.smartSeatsFromSeats(type, seatData);
      return this.smartSeatDataFromSmartSeats(type, smartSeats);
    }
  }, {
    key: 'unitySeatWithSeatData',
    value: function unitySeatWithSeatData(type, seatData) {
      if (type === 'maoyan' || type === 'meituan' || type === 'dazhong') {
        var _seatList = [];
        var sections = seatData.sections;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(sections), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var section = _step.value;

            for (var sectionId in section) {
              if (section.hasOwnProperty(sectionId)) {
                var _seatMap = section[sectionId].seatMap;
                var _maxRow = section[sectionId].maxRow ? section[sectionId].maxRow : 0;
                var _maxColumn = section[sectionId].maxColumn ? section[sectionId].maxColumn : 0;
                for (var i = 0; i <= _maxRow; i++) {
                  for (var j = 0; j <= _maxColumn; j++) {
                    var seat = _seatMap[i + ':' + j];

                    if (seat && seat.status !== 'E') {
                      seat.sectionId = sectionId;

                      _seatList.push(seat);
                    }
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return _seatList;
      }

      if (!seatData) {
        return [];
      }

      if (type === 'taobao' && !seatData.regular) {
        seatData = this.handleTaoBaoSeatData(seatData);
      }

      var seatList = [];
      var seatMap = seatData.seatMap;
      var maxRow = seatData.maxRow;
      var maxColumn = seatData.maxColumn;

      if (type === 'danche') {
        for (var _i = 0; _i <= maxRow; _i++) {
          for (var _j = 0; _j <= maxColumn; _j++) {
            var _seat = seatMap[_i + ':' + _j];
            if (_seat && _seat.isSeat) {
              seatList.push(_seat);
            }
          }
        }
      } else if (type === 'baidu') {
        for (var _i2 = 0; _i2 <= maxRow; _i2++) {
          for (var _j2 = 0; _j2 <= maxColumn; _j2++) {
            var _seat2 = seatMap[_i2 + ':' + _j2];
            if (_seat2 && _seat2.seatNo && _seat2.seatNo !== '') {
              _seat2.rowId = _i2;
              _seat2.columnId = _j2;

              seatList.push(_seat2);
            }
          }
        }
      } else {
        for (var _i3 = 0; _i3 <= maxRow; _i3++) {
          for (var _j3 = 0; _j3 <= maxColumn; _j3++) {
            var _seat3 = seatMap[_i3 + ':' + _j3];
            if (_seat3) {
              seatList.push(_seat3);
            }
          }
        }
      }
      return seatList;
    }
  }, {
    key: 'handleTaoBaoSeatData',
    value: function handleTaoBaoSeatData(seatData) {
      var seatMap = seatData.seatMap;
      var seatRowList = [];
      var seatColList = [];
      for (var key in seatMap) {
        if (seatMap.hasOwnProperty(key)) {
          var location = key.split(':');
          seatRowList.push(parseInt(location[0]));
          seatColList.push(parseInt(location[1]));
        }
      }
      seatRowList.sort(function (a, b) {
        return a - b && (a - b) / Math.abs(a - b);
      });
      seatColList.sort(function (a, b) {
        return a - b && (a - b) / Math.abs(a - b);
      });
      var closeRowSpace = {};
      var closeColSpace = {};
      for (var i = 1, l = Math.min(seatRowList.length, seatColList.length); i < l; i++) {
        var rowOffset = seatRowList[i] - seatRowList[i - 1];
        if (closeRowSpace.hasOwnProperty(rowOffset)) {
          closeRowSpace[rowOffset]++;
        } else {
          closeRowSpace[rowOffset] = 1;
        }

        var colOffset = seatColList[i] - seatColList[i - 1];
        if (closeColSpace.hasOwnProperty(colOffset)) {
          closeColSpace[colOffset]++;
        } else {
          closeColSpace[colOffset] = 1;
        }
      }

      var rowSpace = Number.MAX_VALUE;
      var rowStress = 0;
      for (var spaceString in closeRowSpace) {
        var space = parseInt(spaceString);
        if (space !== 0 && closeRowSpace[space] > rowStress) {
          rowSpace = space;
          rowStress = closeRowSpace[space];
        }
      }

      var colSpace = Number.MAX_VALUE;
      var colStress = 0;
      for (var _spaceString in closeColSpace) {
        var _space = parseInt(_spaceString);
        if (_space !== 0 && closeColSpace[_space] > colStress) {
          colSpace = _space;
          colStress = closeColSpace[_space];
        }
      }

      var filteredSeatMap = {};
      for (var _key in seatMap) {
        if (seatMap.hasOwnProperty(_key)) {
          var _location = _key.split(':');
          var filteredRow = Math.floor(_location[0] / rowSpace);
          var filteredCol = Math.floor(_location[1] / colSpace);
          var rowId = Math.floor(seatMap[_key].rowId / rowSpace);
          var columnId = Math.floor(seatMap[_key].columnId / colSpace);
          filteredSeatMap[filteredRow + ':' + filteredCol] = (0, _extends3.default)({}, seatMap[_key], { rowId: rowId, columnId: columnId });
        }
      }
      seatData.seatMap = filteredSeatMap;
      console.log(seatData);
      return seatData;
    }
  }, {
    key: 'smartSeatsWithSeats',
    value: function smartSeatsWithSeats(type, seatList) {
      var smartSeats = [];
      if (type === 'wangpiao') {
        smartSeats = this.smartSeatsWithWPSeats(seatList);
      }
      if (type === 'spider') {
        smartSeats = this.smartSeatsWithSPSeats(seatList);
      }
      if (type === 'maizuo') {
        smartSeats = this.smartSeatsWithMZSeats(seatList);
      }
      if (type === 'danche') {
        smartSeats = this.smartSeatsWithDCSeats(seatList);
      }
      if (type === 'maoyan' || type === 'meituan' || type === 'dazhong') {
        smartSeats = this.smartSeatsWithMYSeats(seatList);
      }
      if (type === 'baidu') {
        smartSeats = this.smartSeatsWithBDSeats(seatList);
      }
      if (type === 'taobao') {
        smartSeats = this.smartSeatsWithTBSeats(seatList);
      }
      var minRow = Number.MAX_VALUE;
      var minCol = Number.MAX_VALUE;
      smartSeats.forEach(function (seat) {
        minRow = Math.min(minRow, seat.row);
        minCol = Math.min(minCol, seat.col);
      });
      smartSeats.forEach(function (seat) {
        seat.adjustRow = seat.row - minRow;
        seat.adjustCol = seat.col - minCol;
        seat.rowLocation -= minRow * (_cellSize + _cellRowSpace);
        seat.colLocation -= minCol * (_cellSize + _cellColSpace);
      });
      return smartSeats;
    }
  }, {
    key: 'smartSeatsWithWPSeats',
    value: function smartSeatsWithWPSeats(seatList) {
      return seatList.map(function (seatModel) {
        var row = (0, _parseInt2.default)(seatModel.key.split(':').shift());
        var col = (0, _parseInt2.default)(seatModel.key.split(':').pop());
        var rowOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.rowName);
        var colOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.columnName);
        var rowNumber = _JToolString2.default.numberFromString(seatModel.Name.split(':').shift(), true, 1);
        var colNumber = _JToolString2.default.numberFromString(seatModel.Name.split(':').pop(), true, 1);
        return {
          rowOriNumber: rowOriNumber,
          colOriNumber: colOriNumber,
          row: row,
          col: col,
          rowNumber: rowNumber,
          colNumber: colNumber,
          seatModel: seatModel
        };
      }).map(function (bridgeModel) {
        var seatRowModel = bridgeModel.seatModel;
        return (0, _extends3.default)({}, bridgeModel, {
          status: seatRowModel.Status === 'Y' ? 0 : 1,
          rowLocation: bridgeModel.row * (_cellSize + _cellRowSpace),
          colLocation: bridgeModel.col * (_cellSize + _cellColSpace),
          loveIndex: (0, _parseInt2.default)(seatRowModel.LoveFlag)
        });
      });
    }
  }, {
    key: 'smartSeatsWithSPSeats',
    value: function smartSeatsWithSPSeats(seatList) {
      return seatList.map(function (seatModel) {
        var row = (0, _parseInt2.default)(seatModel.rowNum);
        var col = (0, _parseInt2.default)(seatModel.columnNum);
        var rowOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.rowName);
        var colOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.columnName);
        var rowNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(seatModel.rowId, true, 1));
        var colNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(seatModel.columnId, true, 1));
        return {
          rowOriNumber: rowOriNumber,
          colOriNumber: colOriNumber,
          row: row,
          col: col,
          rowNumber: rowNumber,
          colNumber: colNumber,
          seatModel: seatModel
        };
      }).map(function (bridgeModel) {
        var seatRowModel = bridgeModel.seatModel;
        return (0, _extends3.default)({}, bridgeModel, {
          status: seatRowModel.isLock ? 1 : 0,
          rowLocation: bridgeModel.row * (_cellSize + _cellRowSpace),
          colLocation: bridgeModel.col * (_cellSize + _cellColSpace),
          loveIndex: (0, _parseInt2.default)(seatRowModel.loveIndex)
        });
      });
    }
  }, {
    key: 'smartSeatsWithMZSeats',
    value: function smartSeatsWithMZSeats(seatList) {
      return seatList.map(function (seatModel) {
        var row = (0, _parseInt2.default)(seatModel.rowNum);
        var col = (0, _parseInt2.default)(seatModel.columnNum);
        var rowOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.rowName);
        var colOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.columnName);
        var rowNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(seatModel.rowId, true, 1));
        var colNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(seatModel.columnId, true, 1));

        return {
          rowOriNumber: rowOriNumber,
          colOriNumber: colOriNumber,
          row: row,
          col: col,
          rowNumber: rowNumber,
          colNumber: colNumber,
          seatModel: seatModel
        };
      }).map(function (bridgeModel) {
        var seatRowModel = bridgeModel.seatModel;
        return (0, _extends3.default)({}, bridgeModel, {
          status: seatRowModel.isLock === '1' ? 1 : 0,
          rowLocation: bridgeModel.row * (_cellSize + _cellRowSpace),
          colLocation: bridgeModel.col * (_cellSize + _cellColSpace),
          loveIndex: (0, _parseInt2.default)(seatRowModel.loveIndex)
        });
      });
    }
  }, {
    key: 'smartSeatsWithDCSeats',
    value: function smartSeatsWithDCSeats(seatList) {
      return seatList.map(function (seatModel) {
        var row = (0, _parseInt2.default)(seatModel.rowNum);
        var col = (0, _parseInt2.default)(seatModel.columnNum);
        var rowOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.rowName);
        var colOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.columnName);
        var rowNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(seatModel.rowId, true, 1));
        var colNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(seatModel.columnId, true, 1));
        return {
          rowOriNumber: rowOriNumber,
          colOriNumber: colOriNumber,
          row: row,
          col: col,
          rowNumber: rowNumber,
          colNumber: colNumber,
          seatModel: seatModel
        };
      }).map(function (bridgeModel) {
        var seatRowModel = bridgeModel.seatModel;
        console.log(seatRowModel.loveIndex);
        return (0, _extends3.default)({}, bridgeModel, {
          status: seatRowModel.isLock ? 1 : 0,
          rowLocation: bridgeModel.row * (_cellSize + _cellRowSpace),
          colLocation: bridgeModel.col * (_cellSize + _cellColSpace),
          loveIndex: (0, _parseInt2.default)(seatRowModel.loveIndex)
        });
      });
    }
  }, {
    key: 'smartSeatsWithMYSeats',
    value: function smartSeatsWithMYSeats(seatList) {
      return seatList.map(function (seatModel) {
        var row = (0, _parseInt2.default)(seatModel.rowNo);
        var col = (0, _parseInt2.default)(seatModel.columnNo);
        var rowOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.rowName);
        var colOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.columnName);
        var rowNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(seatModel.rowId, true, 1));
        var colNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(seatModel.columnId, true, 1));
        return {
          rowOriNumber: rowOriNumber,
          colOriNumber: colOriNumber,
          row: row,
          col: col,
          rowNumber: rowNumber,
          colNumber: colNumber,
          seatModel: seatModel
        };
      }).map(function (bridgeModel) {
        var seatRowModel = bridgeModel.seatModel;
        var loveIndex = 0;
        if (seatRowModel.status === 'L') {
          loveIndex = 1;
        } else if (seatRowModel.status === 'R') {
          loveIndex = 2;
        }
        return (0, _extends3.default)({}, bridgeModel, {
          status: seatRowModel.status === 'LK' ? 1 : 0,
          rowLocation: bridgeModel.row * (_cellSize + _cellRowSpace),
          colLocation: bridgeModel.col * (_cellSize + _cellColSpace),
          loveIndex: loveIndex
        });
      });
    }
  }, {
    key: 'smartSeatsWithBDSeats',
    value: function smartSeatsWithBDSeats(seatList) {
      return seatList.map(function (seatModel) {
        var row = (0, _parseInt2.default)(seatModel.rowId);
        var col = (0, _parseInt2.default)(seatModel.columnId);
        var rowOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.rowName);
        var colOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.columnName);
        var rowNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(seatModel.rowNo, true, 1));
        var colNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(seatModel.columnNo, true, 1));
        return {
          rowOriNumber: rowOriNumber,
          colOriNumber: colOriNumber,
          row: row,
          col: col,
          rowNumber: rowNumber,
          colNumber: colNumber,
          seatModel: seatModel
        };
      }).map(function (bridgeModel) {
        var seatRowModel = bridgeModel.seatModel;
        return (0, _extends3.default)({}, bridgeModel, {
          status: seatRowModel.status === '2' ? 1 : 0,
          rowLocation: bridgeModel.row * (_cellSize + _cellRowSpace),
          colLocation: bridgeModel.col * (_cellSize + _cellColSpace),
          loveIndex: (0, _parseInt2.default)(seatRowModel.isLove),
          areaInfo: seatRowModel.area
        });
      });
    }
  }, {
    key: 'smartSeatsWithTBSeats',
    value: function smartSeatsWithTBSeats(seatList) {
      return seatList.map(function (seatModel) {
        var row = (0, _parseInt2.default)(seatModel.rowId);
        var col = (0, _parseInt2.default)(seatModel.columnId);
        var rowOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.rowName);
        var colOriNumber = _JToolString2.default.numberRemoveLeftZero(seatModel.columnName);
        var rowNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(rowOriNumber, true, 1));
        var colNumber = (0, _parseInt2.default)(_JToolString2.default.numberFromString(colOriNumber, true, 1));
        return {
          rowOriNumber: rowOriNumber,
          colOriNumber: colOriNumber,
          row: row,
          col: col,
          rowNumber: rowNumber,
          colNumber: colNumber,
          seatModel: seatModel
        };
      }).map(function (bridgeModel) {
        var seatRowModel = bridgeModel.seatModel;
        var loveIndex = 0;
        loveIndex = seatRowModel.loveIndex;
        return (0, _extends3.default)({}, bridgeModel, {
          status: seatRowModel.status === 0 ? 1 : 0,
          rowLocation: bridgeModel.row * (_cellSize + _cellRowSpace),
          colLocation: bridgeModel.col * (_cellSize + _cellColSpace),
          loveIndex: loveIndex
        });
      });
    }
  }, {
    key: 'seatContentSizeWithSmartSeats',
    value: function seatContentSizeWithSmartSeats(smartSeats) {
      var maxWidth = 0;
      var maxHeight = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(smartSeats), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var smartSeatModel = _step2.value;

          if (maxWidth < smartSeatModel.colLocation) {
            maxWidth = smartSeatModel.colLocation;
          }
          if (maxHeight < smartSeatModel.rowLocation) {
            maxHeight = smartSeatModel.rowLocation;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var seatContentWidth = maxWidth + _cellSize;
      var seatContentHeight = maxHeight + _cellSize;
      return { 'width': seatContentWidth, 'height': seatContentHeight };
    }
  }, {
    key: 'seatContentDataFromSmartSeats',
    value: function seatContentDataFromSmartSeats(smartSeats) {
      var seatContentSize = this.seatContentSizeWithSmartSeats(smartSeats);
      return {
        'seatCellRowSpace': _cellRowSpace,
        'seatCellColSpace': _cellColSpace,
        'seatCellWidth': _cellSize,
        'seatCellHeight': _cellSize,
        'seatContentWidth': seatContentSize.width,
        'seatContentHeight': seatContentSize.height
      };
    }
  }, {
    key: 'rowDataFromSmartSeats',
    value: function rowDataFromSmartSeats(smartSeats) {
      var dict = new _map2.default();
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(smartSeats), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var seat = _step3.value;

          var row = seat.rowNumber;
          if (dict.hasOwnProperty(row)) {
            continue;
          }
          dict.set(row, seat.rowLocation);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var allRowNumber = dict.keys();
      var allRowData = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)(allRowNumber), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var rowNumber = _step4.value;

          allRowData.push({ rowNumber: rowNumber, colLocation: dict.get(rowNumber) });
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return allRowData.sort(function (a, b) {
        return a.rowNumber.toString().localeCompare(b.rowNumber.toString());
      });
    }
  }], [{
    key: 'defaultManager',
    value: function defaultManager() {
      return new SeatManager();
    }
  }, {
    key: 'smartAutoSelected',
    value: function smartAutoSelected(smartSeats, count) {
      return new _promise2.default(function (reduce, reject) {
        _AutoSeatPicking2.default.defaultManager().autoSelected(smartSeats, count, function (data) {
          reduce(data);
        });
      });
    }
  }, {
    key: 'seatParasFromScreening',
    value: function seatParasFromScreening(platform, screening) {
      var paras = {};
      if (platform === 'wangpiao') {
        paras = {
          cinemaId: screening.cinemaId,
          showId: screening.showId
        };
      }

      if (platform === 'spider') {
        paras = {
          cinemaId: screening.cinemaId,
          showId: screening.showId,
          hallId: screening.hallId
        };
      }

      if (platform === 'maizuo') {
        paras = {
          showId: screening.showId
        };
      }

      if (platform === 'danche') {
        paras = {
          showId: screening.showId
        };
      }

      if (platform === 'maoyan' || platform === 'meituan' || platform === 'dazhong') {
        paras = {
          showId: screening.showId
        };
      }

      if (platform === 'baidu') {
        paras = {
          showId: screening.showId
        };
      }

      if (platform === 'taobao') {
        paras = {
          cinemaId: platform.cinemaId,
          showId: platform.showId,
          sectionId: platform.sectionId
        };
      }
      return paras;
    }
  }]);
  return SeatManager;
}();

exports.default = SeatManager;