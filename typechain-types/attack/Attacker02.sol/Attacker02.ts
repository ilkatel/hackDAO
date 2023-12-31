/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface Attacker02Interface extends Interface {
  getFunction(
    nameOrSignature: "attacker" | "deploy" | "killAll" | "killSelf"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "attacker", values?: undefined): string;
  encodeFunctionData(functionFragment: "deploy", values: [boolean]): string;
  encodeFunctionData(functionFragment: "killAll", values?: undefined): string;
  encodeFunctionData(functionFragment: "killSelf", values?: undefined): string;

  decodeFunctionResult(functionFragment: "attacker", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deploy", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "killAll", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "killSelf", data: BytesLike): Result;
}

export interface Attacker02 extends BaseContract {
  connect(runner?: ContractRunner | null): Attacker02;
  waitForDeployment(): Promise<this>;

  interface: Attacker02Interface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  attacker: TypedContractMethod<[], [string], "view">;

  deploy: TypedContractMethod<[isDefault: boolean], [string], "nonpayable">;

  killAll: TypedContractMethod<[], [void], "nonpayable">;

  killSelf: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "attacker"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "deploy"
  ): TypedContractMethod<[isDefault: boolean], [string], "nonpayable">;
  getFunction(
    nameOrSignature: "killAll"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "killSelf"
  ): TypedContractMethod<[], [void], "nonpayable">;

  filters: {};
}
