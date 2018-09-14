const chai = require('chai');
// var chaiHttp = require('chai-http');
// var server = require('../app');
const should = chai.should();
// const expect = require('chai').expect
const moment = require('moment')

const correctTimezone = require('../utils/correctTimezone')
const minusOneDay = require('../utils/minusOneDay')
const numberWithCommas = require('../utils/numberWithCommas')

const policyArray = require('./policyArray')
const expectPolicyArray = require('./expectPolicyArray')

const tz = 'Asia/Bangkok'

// chai.use(chaiHttp);

// describe('/GET Home', () => {
//   it('it should GET home page', (done) => {
//     chai.request(server)
//       .get('/')
//       .end((err, res) => {
//         res.should.have.status(200);
//         done();
//       });
//   });
// });

// describe('/GET detail', () => {
//   it('it should not GET detail without policy number', (done) => {
//     chai.request(server)
//       .get('/detail')
//       .end((err, res) => {
//         res.should.have.status(404);
//         done();
//       });
//   });
//   it('it should GET detail of policy number 506-2646319', (done) => {
//     chai.request(server)
//       .get('/detail/506-2646319')
//       .end((err, res) => {
//         res.should.have.status(200);
//         done();
//       });
//   });
// });

describe('correctTimezone', () => {
	it('it should return list of +7 UCT in submitted property of policies', () => {
		const startDate = moment('2018-05-04').format('YYYY-MM-DD'), endDate = moment('2018-05-04').format('YYYY-MM-DD')
		const resultArray = correctTimezone(policyArray, startDate, endDate, tz)
		resultArray.should.deep.equal(expectPolicyArray)
		resultArray.should.have.lengthOf(expectPolicyArray.length)
	})
})

describe('minusOneDay', () => {
	it('it should return FALSE if it cannot parse the given string', () => {
		minusOneDay('ABVC').should.equal(false)
	})
	it('it should return yesterday', () => {
		minusOneDay('2018-04-04').should.equal('2018-04-03')
	})
})

describe('numberWithCommas',() => {
	it('it should return number with commas every 3rd digit', () => {
		numberWithCommas('1234567890').should.equal('1,234,567,890')
		numberWithCommas(1234567890).should.equal('1,234,567,890')
		numberWithCommas('12a345b6c7890').should.equal('12a,345b6c7,890')
	})
})