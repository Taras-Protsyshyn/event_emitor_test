class Bank {
  constructor() {
    this.contrAgents = [];
  }

  _generateContrAgentId() {
    return Math.random();
  }

  _getContrAgentIndex(id) {
    const contrAgentIndex = this.contrAgents.findIndex(
      (agent) => agent.id === id
    );
    try {
      if (contrAgentIndex === -1) {
        throw new Error("This agent not exists");
      }

      return contrAgentIndex;
    } catch (error) {
      console.error(error);
    }
  }

  _checkCorrectBalance(balance) {
    try {
      if (balance <= 0) {
        throw new Error("Balance can not be 0 or less");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  register(contrAgent) {
    if (!contrAgent) return;

    try {
      if (this.contrAgents.find((el) => el.name === contrAgent.name)) {
        throw new Error("This agent already exist");
      }

      this._checkCorrectBalance(contrAgent.balance);

      const id = this._generateContrAgentId();

      this.contrAgents.push({
        ...contrAgent,
        id,
      });

      return id;
    } catch (error) {
      console.log(error.message);
    }
  }

  add(id, sum) {
    this._checkCorrectBalance(sum);
    const agentIndex = this._getContrAgentIndex(id);

    this.contrAgents[agentIndex].balance += sum;
  }

  get(id, cd) {
    const contrAgentIndex = this._getContrAgentIndex(id);
    const balance = this.contrAgents[contrAgentIndex].balance;
    return cd(balance);
  }
}

const myBank = new Bank();

myBank.register({
  name: "taras",
  balance: 10,
});

console.log(myBank.contrAgents);

const firstAgent = myBank.contrAgents[0].id;

myBank.add(firstAgent, 40);

console.log(myBank.contrAgents);

myBank.get(firstAgent, (balance) => console.log('contrAgentIndex balance >>>>>>>', balance));

