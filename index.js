const EventEmitter = require('events');

class Bank extends EventEmitter {
  constructor() {
    super();
    this.contrAgents = [];

    this.on('register', this.register);
    this.on('add', this.add );
    this.on('get', this.get );
    this.on('withdraw', this.withdraw);
    this.on('send', this.send);
    this.on('changeLimit', this.changeLimit)
    this.on('error', this._handleError)
  }

  _handleError(errorType) {
    try{
      switch(errorType) {
        case 'limitError':
          throw new Error('Limit is not corect!');
      }
    } catch(error) {
      console.error(error.message);
    }
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

  _checkCorrectSum(balance) {
    try {
      if (balance <= 0) {
        throw new Error("Balance can not be 0 or less");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  _checkCorrectBalance(sum, agent) {
    this._checkCorrectSum(sum);
     
    if(agent.limit) {
     if(!agent.limit(sum, agent.balance, agent.balance - sum)) {
      this.emit('error', 'limitError');
      return false;
     }  
    }
    
    return true;
  }

  register(contrAgent) {
    if (!contrAgent) return;

    try {
      if (this.contrAgents.find((el) => el.name === contrAgent.name)) {
        throw new Error("This agent already exist");
      }

      this._checkCorrectSum(contrAgent.balance);

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
    this._checkCorrectSum(sum);
    const agentIndex = this._getContrAgentIndex(id);

    this.contrAgents[agentIndex].balance += sum;
  }

  get(id, cd) {
    const contrAgentIndex = this._getContrAgentIndex(id);
    const balance = this.contrAgents[contrAgentIndex].balance;
    return cd(balance);
  }

  withdraw(id, sum) {
    const agentIndex = this._getContrAgentIndex(id);
    
    const corect = this._checkCorrectBalance(sum, this.contrAgents[agentIndex]);
    if(corect) {
      this.contrAgents[agentIndex].balance -= sum;
    }        
  }

  send (sender, geter, sum) {
    this.withdraw(sender, sum);
    this.add(geter, sum);
  }

  changeLimit( id, cb) {
    const agentIndex = this._getContrAgentIndex(id);
    this.contrAgents[agentIndex].limit = cb;
  }
}

const myBank = new Bank();

const firstAgent = myBank.register({
  name: 'tatars',
  balance: 100,
  limit: (amount) => amount < 20,
});

const secondAgent = myBank.register({
  name: 'tom',
  balance: 100,
});

myBank.emit('send', firstAgent, secondAgent, 20);

myBank.emit('get', firstAgent,
 (balance) => console.log('balance >>>>>>>', balance)
 );

myBank.emit('changeLimit', firstAgent, (amount) => amount < 30);
myBank.emit('send', firstAgent, secondAgent, 20);
myBank.emit('get', firstAgent,
 (balance) => console.log('balance >>>>>>>', balance)
 );
