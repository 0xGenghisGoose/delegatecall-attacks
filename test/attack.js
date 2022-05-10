const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers, waffle } = require('hardhat');

describe('Attack', function () {
	it('Should change the owner of the Good contract', async function () {
		// Deploy the three contracts
		const helperContract = await ethers.getContractFactory('Helper');
		const helper = await helperContract.deploy();
		await helper.deployed();
		console.log("Helper contract's address:", helper.address);

		const goodContract = await ethers.getContractFactory('Good');
		const good = await goodContract.deploy(helper.address);
		await good.deployed();
		console.log("Good contract's address:", good.address);

		const attackContract = await ethers.getContractFactory('Attack');
		const attack = await attackContract.deploy(good.address);
		await attack.deployed();
		console.log("Attack contract's address:", attack.address);

		// Start the attack
		let tx = await attack.attack();
		await tx.wait();

		// Check to see if Good contract's owner address has changed to Attack contract address
		expect(await good.owner()).to.equal(attack.address);
	});
});
