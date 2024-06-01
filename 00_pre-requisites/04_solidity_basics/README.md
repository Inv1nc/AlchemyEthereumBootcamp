## Resources

- Presentations: https://github.com/alchemyplatform/learn-solidity-presentations
- Foundry: https://book.getfoundry.sh/

---

## Smart Contracts: A Blockchain Program

A smart contract is blockchain-deployed code. For example:

```js
contract Agreement {
  address recipient;
  bool conditionIsMet;

  function payout() external {
    if(conditionIsMet) {
      sendValue(recipient);
    }
  }

  // ...
}
```

### Deploying a Contract

1. ⚙️ compile your **solidity** to bytecode
2. ✉️ send a transaction containing the bytecode to an EVM node
3. 🏡 the node calculates an address for your new contract


### Contract Deployment


| Opcode | Name | Description              | Gas |
| ------ | ---- | ------------------------ | --- |
| `0x00` | STOP | Halts execution          | 0   |
| `0x01` | ADD  | Addition operation       | 3   |
| `0x02` | MUL  | Multiplication operation | 5   |
| `0x03` | SUB  | Subtraction operation    | 3   |

https://ethereum.org/en/developers/docs/evm/opcodes/

1. ⚙️ Contracts are compiled to creation bytecode
2. ⛓ The `data` field contains your creation bytecode
3. 📭 The `to` field is left blank to deploy a contract
4. 🏡 Your contract will have an address, balance and runtime bytecode

### Transaction Life Cycle


1. 🥾 Transactions begin at an EOA
2. ☝️ Transactions occur sequentially
3. ⛽️ Transactions set a gas limit
4. 🎯 Transactions send calldata, targetting a contract method
5. 🌐 Similarly smart contracts can call each other within the one transaction

---

## Solidity Value Types

Let's look at a few important types

```js
contract Example {
  uint a;
  int b;
  bool c;

  enum Choice { Up, Down, Left, Right }
  Choice choice = Choice.Up;
}
```

**Unsigned Integer**: A number without a sign (not positive or negative)

```js
contract Example {
  // uint can be declared in steps of 8
  // where the number represents the number of bits
  uint8 x; // 0 -> 255
  uint16 y;

  // uint is an alias for uint256
  uint z1;
  uint256 z2;
}
```

**Integer**: A number that could be either positive or negative

```js
contract Example {
  // uint can be declared in steps of 8
  // where the number represents the number of bits
  int8 x; // -128 -> 127
  int16 y;

  // int is an alias for int256
  int z1;
  int256 z2;
}
```

**Boolean**: Either `true` or `false`

```js
import "forge-std/console.sol";

contract Example {
  constructor(bool myCondition) {
    if(myCondition) {
      // will log yay if myCondition is true
      console.log("yay!");
    }
  }
}
```

**Enum**: Defining options for a value by name

```js
import "forge-std/console.sol";

contract Example {
  enum Choice { Up, Down, Left, Right }

  constructor(Choice choice) {
    if(choice == Choice.Up) {
      console.log("up");
    }
    if(choice == Choice.Down) {
      console.log("down");
    }
  }
}
```

### Storage Variables

Variables declared in contract scope are storage variables

Solidity stores these in contiguous storage slots

```js
contract Example {
  uint256 a; // storage slot - 0x0
  uint256 b; // storage slot - 0x1
  bool public c; // storage slot - 0x2

  function store() external {
    // read storage slot 0x1
    // store it in storage slot 0x0
    a = b;

    // read storage slot 0x1
    // store it in memory (not persistent!)
    uint x = b;
  }
}
```

### Things to know about storage slots

- 🔭 variables stored in contract scope allocate a storage slot (except for `constant`)
- 📏 slots are 32 bytes (`0x1` means `0x000....001`)
- 🔢 solidity stores variables contiguously (`0x0`, `0x1`, etc...)
- 💸 reading/writing to storage is relatively super expensive to other opcodes
- 🎒 variables can be packed together, automatically or manually
---

### FUNctions 🕺

You can't spell functions without **fun**! 😆 And you must know the keywords 🔑

```js
contract Example {
  function example1() private pure {
    // private: call me within this contract
    // pure: I cannot read/write to storage
  }
  function example2() internal view {
    // internal: call me within this contract (+ inheritance!)
    // view: I can read from storage, not write
  }
  function example3() public payable {
    // public: call me inside and outside this contract
    // payable: send me some ether!
  }
  function example4() external {
    // external: call me from outside this contract
  }
}
```

### Returning values

```js
contract Example {
  uint public sum;

  constructor(uint x, uint y) {
    sum = add(x, y);
  }

  function add(uint x, uint y) private pure returns(uint) {
    return x + y;
  }
}
```
---

## Message Calls

- Send value and `calldata` to contracts
- The first message call is the beginning of the transaction (EOA -> contract)
- Each subsequent message call is part of the same transaction (contract -> contract)
- The transaction and any state changes only complete when the initial function call finishes execution

### Message Call Breakdown

- As we saw message calls can contain `gas`, `value` and `calldata`
- These message values become available as globals in solidity:

  - `msg.sender` - who made the last message call
  - `msg.value` - amount in wei sent
  - `msg.data` - calldata
  - `msg.sig` - the function identifier

### How Do EOAs and Contracts Call Other Contracts?

- They use the `address` of the contract they want to communicate with
- This is a data type in solidity that is 20 bytes long
- The `msg.sender` from the previous slide is an address

### What does that look like?

```js
contract X {
  address deployer;
  address otherContract;

  constructor(address _otherContract) {
    deployer = msg.sender;
    otherContract = _otherContract;
  }
}
```

### Can any method call receive ether?

Only `payable` methods can:

```js
contract X {
  receive() external payable {
    // no calldata necessary here
    // just send a value on the message call
  }

  function pay() external payable {
    // in this case, we target pay with a value
  }
}
```

### What does sending value look like?

The `.call` syntax is `.call{ gas, value }(calldata)`

```js
contract X {
  address otherContract;

  constructor(address _otherContract) payable {
    otherContract = _otherContract;
    _otherContract.call{ value: msg.value }("");
  }
}
```

### Handle the success

The solidity compiler will warn you if you don't handle `success`

```js
contract X {
  address otherContract;

  constructor(address _otherContract) payable {
    otherContract = _otherContract;
    (bool success, ) = _otherContract.call{ value: msg.value }("");
    require(success);
  }
}
```
---

## Revert

- We talk to a contract with message calls
- A contract can `REVERT` a call, negating all state changes
- Each calling contract can choose to handle that success, or `REVERT` as well

### Message Call Revert

- 🙅‍♀️ No state changes occur
- 🙅‍♀️ No value is transfered
- 🙅‍♀️ No logs are emitted
- ⛽️ Gas is still spent

### Require

Often you'll see `require` used like this:

```js
contract X {
  // shorthand!
  address owner = msg.sender;

  function ownerOnly() external {
    // REVERT if not the owner
    require(msg.sender == owner, "only owner!");
    // do something owner-y
  }
}
```
### Revert

Revert can be used with a string `revert("Unauthorized")` or, better yet:

```js
contract X {
  // @notice a non-privileged user attempted to access an admin-only method
  error Unauthorized();

  function adminOnly() external {
    if (!isAdmin(msg.sender)) {
      revert Unauthorized();
    }
  }
}
```

👆⛽️ _Gas Efficient_!
\### Assert

Use `assert` with things that should not happen:

```js
contract X {
  function withdraw() external {
    uint balance = getBalance(msg.sender);
    sendBalance(msg.sender);

    // they should not still have a balance!
    assert(getBalance(msg.sender) == 0);
  }
}
```
---

## Calldata (how to target functions!)

- its helpful to remember that Solidity's job is to compile contracts to bytecode
- Solidity doesnt know about the chain its deployed on
- if you tell solidity to call an address with calldata, it will do that
- you do this with both the high-level and low-level syntax

### High Level Syntax

First off, the high level syntax for message calls targetting functions:

```js
contract A {
  uint sum;
  function storeSum(address b) external {
    sum = B(b).add(5, 10);
  }
}

contract B {
  function add(uint x, uint y) external returns(uint) {
    return x + y;
  }
}
```

### Same thing

The argument is an address either way:

```js
function storeSum(B b) external {
  sum = b.add(5, 10);
}
```

Or:

```js
function storeSum(address b) external {
  sum = B(b).add(5, 10);
}
```

### Also, interfaces

The argument is an address either way:

```js
contract A {
  uint sum;
  function storeSum(B b) external {
    sum = b.add(5, 10);
  }
}

interface B {
  function add(uint, uint) external returns(uint);
}
```

👆 this is a message call, you are defining calldata

### Low Level Syntax

Ok, so how about the low-level way?

```js
contract A {
  uint sum;
  function storeSum(address b) external {
    (bool success, bytes memory returnData) =
      b.call(abi.encodeWithSignature("add(uint256,uint256)", 5, 10));
    sum = abi.decode(returnData, (uint));
    require(success);
  }
}

contract B {
  function add(uint x, uint y) external pure returns(uint) {
    return x + y;
  }
}
```

### EncodeWithSignature Breakdown

What is `abi.encodeWithSignature` doing? It is combining:

- first 4 bytes of the `keccak256` of the `add` method - `0x771602f7`
- the first argument as a uint256 - `0x0000000000000000000000000000000000000000000000000000000000000005`
- the second argument as a uint256 - `0x000000000000000000000000000000000000000000000000000000000000000a`

Final calldata: `0x771602f70000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000a`

### Sending Calldata

Regardless of which syntax you use, solidity is compiling a contract to send some calldata `0x771602f70000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000a` to some address.  

It's up to you, as a developer, to make sure that contract responds to that calldata.

---

## Escrow: Let's get real world!

- 🧠 you now understand storage, value/data transfer between smart contracts
- 🎉 you can now produce useful solidity contracts!
- 📜 let's build an escrow agreement between 2 parties to transfer some value, arbitrated by a 3rd party

### Let the world know! 📣

Emit an **event** when something important happens!

```js
contract Escrow {
  event Approved(uint);

  function approve() external {
    // ...

    emit Approved(address(this).balance);
  }
}
```

---

## Arrays

- Arrays are our first reference type! 🎊
- Arrays act quite differently in storage vs memory/calldata 💿
- Arrays aren't used as frequently as mappings 😢
  - useful for ordered data or when you need iteration 🔢
  - unlimited size plus iteration can be a DOS vector ⛽️

### Reference Types

- Reference Types: `string`, `bytes`, `arrays`, `mappings`, and `structs`
- As an argument you must declare the memory location: `calldata`, `memory` or `storage`
- _Potentially_ passed by reference, as opposed to value types

Let's take a look at the data locations!

### Storage

In storage, arrays can be dynamic size or fixed size:

```js
contract X {
  uint[3] favoriteNumbers;
  uint[] allNumbers;

  constructor() {
    // push is allowed on dyamic arrays
    allNumbers.push(1);

    // not allowed on fixed size arrays
    favoriteNumbers[0] = 1;
  }
}
```

### Storage

For reference types, they can be passed by reference as a storage pointer:

```js
import "forge-std/console.sol";
contract X {
  uint[3] favoriteNumbers;

  constructor() {
    modifyArray(favoriteNumbers);

    console.log(favoriteNumbers[0]); // 22
  }

  function modifyArray(uint[3] storage nums) private {
    nums[0] = 22;
  }
}
```

### Calldata

Refers to the data passed into the function, read-only:

```js
import "forge-std/console.sol";
contract X {
  function readArr(uint[3] calldata arr) external view {
    // cannot write to the array
    console.log(arr[0]);
  }
}
```

### Memory

Temporary location, creates a copy of the reference type passed in:

```js
import "forge-std/console.sol";
contract X {
  function readArr(uint[3] memory arr) external view {
    arr[0] = 5;
    console.log(arr[0]); // 5
  }
}
```
---

## Structs

- 🧺 group variables under a single name
- 💿 can be stored in the different data locations
- 🪆 can go within other structs/arrays/mappings

Example:

```js
struct User {
  bool isActive;
  uint balance;
}

User user = User(true, 0);
```

### Grouping Variables

```js
contract Escrow {
    struct Agreement {
      address depositor;
      address beneficiary;
      address arbiter;
      uint paymentAmount;
    }
    Agreement agreement;

    constructor(Agreement memory _agreement) {
      agreement = _agreement;
    }
}
```

### Modeling Data

```js
contract X {
    enum OrderStatus { Created, Paid, Shipped, Completed }

    struct Order {
        address buyer;
        address seller;
        uint256 amount;
        OrderStatus status;
    }

    Order[] orders;
}
```
---

## Mappings

- 🔑 key/value hash lookup
- 📦 storage only
- 🙅‍♀️ cannot be passed as an argument

Example:

```js
mapping(address => bool) isMember;

function join() external {
  isMember[msg.sender] = true;
}

function belongs() external view returns(bool) {
  return isMember[msg.sender];
}
```

### Combining Types

```js
// mapping to a struct
mapping(address => User) users;

// mapping to an array of structs
mapping(address => Order[]) ordersByAddress;

// mapping an id to bool
mapping(uint256 => bool) allowedIds;

// mapping in a struct
struct Person {
    mapping(uint256 => Vote) proposalVotes;
}
```

### ⚠️ Be Careful With Nested Mappings in Structs!

```js
contract X {
  struct Proposal {
    bytes data;
    address target;
    mapping(address => bool) votes;
  }

  Proposal[] proposals;

  function newProposal(bytes memory data, address target) external {
    // 🙅‍♀️ Struct containing a (nested) mapping cannot be constructed.
    // Proposal memory proposal = Proposal(data, target);

    // ✅ build it in storage first, then assign fields
    Proposal storage proposal = proposals.push();
    proposal.data = data;
    proposal.target = target;
  }
}
```

### Implementation

```js
contract X {
  mapping(address => bool) isMember; // base slot 0x0

  function join() external {
    // SSTORE(keccak256(msg.sender + 0x0), true)
    isMember[msg.sender] = true;
  }

  function belongs() external view returns(bool) {
    // SLOAD(keccak256(msg.sender + 0x0))
    return isMember[msg.sender];
  }
}
```
