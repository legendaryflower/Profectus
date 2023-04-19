import { Replace, OptionsObject } from "../feature";
import { Computable, GetComputableType, processComputable, ProcessedComputable } from "util/computed";
import { Persistent, State } from "game/persistence";

export type Decorator<FeatureOptions, BaseFeature = {}, GenericFeature = BaseFeature, S extends State = State> = {
    getPersistentData?(): Record<string, Persistent<S>>;
    preConstruct?(feature: OptionsObject<FeatureOptions,BaseFeature,GenericFeature>): void;
    postConstruct?(feature: OptionsObject<FeatureOptions,BaseFeature,GenericFeature>): void;
    getGatheredProps?(feature: OptionsObject<FeatureOptions,BaseFeature,GenericFeature>): Partial<OptionsObject<FeatureOptions,BaseFeature,GenericFeature>>
}

export interface EffectFeatureOptions {
    effect: Computable<any>;
}

export type EffectFeature<T extends EffectFeatureOptions> = Replace<
    T, { effect: GetComputableType<T["effect"]>; }
>;

export type GenericEffectFeature = Replace<
    EffectFeature<EffectFeatureOptions>,
    { effect: ProcessedComputable<any>; }
>;

/**
 * Allows the usage of an `effect` field in the decorated feature.  
 * To function properly, the `createFeature()` function must have its generic type extended by {@linkcode EffectFeatureOptions}.  
 * To allow access to the decorated values outside the `createFeature()` function, the output type must be extended by {@linkcode GenericEffectFeature}.
 * @example ```ts
 * createRepeatable<RepeatableOptions & EffectFeatureOptions>(() => ({
 *   effect() { return Decimal.pow(2, this.amount); },
 *   ...
 * }), effectDecorator) as GenericUpgrade & GenericEffectFeature;
 * ```
 */
export const effectDecorator: Decorator<EffectFeatureOptions, {}, GenericEffectFeature> = {
    postConstruct(feature) {
        processComputable(feature, "effect");
    }
}

