var crypto = require('crypto');

var Marker = new Object({
		begin: '-----BEGIN ',
		end: '-----END ',
		dashx5: '-----',
		nl: '\r\n',
		cleansign: 'PEERCOIN SIGNED MESSAGE',
		signature: 'PEERCOIN SIGNATURE',
		message: 'PEERCOIN MESSAGE',
		comment: 'Comment: Signed by Peercoin Armory CDN'
	});

var Util = new Object({
		sha256: function ( data ) {
			return crypto.createHash('sha256').update(data).digest();
		},
		crc24: function(m) {
			crc = 0xB704CE;
			poly = 0x1864CFB;
			r = '';
			for (o in m) {
				o = o.charCodeAt(0)
				crc ^= (o << 16);
				for (i = 0; i < 8; i++) {
					crc <<= 1;
					if (crc & 0x1000000)
						crc ^= poly;
				}
			}
			for (i=0; i < 3; i++)
				r += String.fromCharCode((crc & (0xff<<(8*i))) >> (8*i));
			return new Buffer(r, 'utf8').toString('base64');
		}
	});

var Notary = function ( privatekey ) {
	this.pkey = privatekey;
};

Notary.prototype.sign = function ( data ) {
	//Fancy Signing Code
	return data;
};

var Message = function ( body ) {
	this.body = body;
	this.signature = Notary.sign(body);
};

Message.prototype.publish = function () {
	output = '';
	output += Marker.begin+Marker.clearsign+Marker.dashx5+Marker.nl;
	output += Marker.comment+Marker.nl+Marker.nl;
	output += this.body+Marker.nl;
	output += Marker.begin+Marker.signature+Marker.dashx5+Marker.nl;
	output += Marker.nl+Marker.nl;
	output += this.signature+Marker.nl;
	output += '='+Util.crc24(this.signature+this.body)+Marker.nl;
	output += Marker.end+Marker.signature;
	return output;
};


module.exports = Notary;
