/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';
import { arrayOf, func, object, string } from 'prop-types';
import SimpleMarkdown from 'simple-markdown';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import pullAll from 'lodash/pullAll';

import type { DefaultProps, Props } from './types';
import initialRules from './rules';
import initialStyles from './styles';

class Markdown extends Component<Props> {
  static defaultProps: DefaultProps = {
    blacklist: [],
    children: '',
    errorHandler: () => null,
    rules: {},
    styles: initialStyles,
    whitelist: [],
    onLinkPress: Function.prototype,
  }

  static propTypes = {
    blacklist: arrayOf(string),
    children: string,
    errorHandler: func,
    rules: object,
    styles: object,
    whitelist: arrayOf(string),
    onLinkPress: func,
  }

  shouldComponentUpdate = (nextProps: Props): boolean => (
    this.props.children !== nextProps.children ||
    this.props.styles !== nextProps.styles
  )

  // @TODO: Rewrite this part to prevent text from overriding other rules
  /** Post processes rules to strip out unwanted styling options
   *  while keeping the default 'paragraph' and 'text' rules
   */
  _postProcessRules = (preRules: Object): Object => {
    const { whitelist, blacklist } = this.props;
    const defaultRules = ['paragraph', 'text'];

    if (whitelist && whitelist.length) {
      return pick(preRules, [...whitelist, ...defaultRules]);
    }
    else if (blacklist && blacklist.length) {
      return omit(preRules, pullAll(blacklist, defaultRules));
    }
    return preRules;
  }

  _renderContent = (children: string): ?React$Element<any> => {
    try {
      const mergedStyles = Object.assign({}, initialStyles, this.props.styles);
      const rules = this._postProcessRules(
        merge(
          {},
          SimpleMarkdown.defaultRules,
          initialRules(mergedStyles, this.props),
          this.props.rules,
        ),
      );
      const child = Array.isArray(this.props.children)
        ? this.props.children.join('')
        : this.props.children;
      // @TODO: Add another \n?
      const blockSource = `${child}\n`;
      const tree = SimpleMarkdown.parserFor(rules)(blockSource, {
        inline: false,
      });
      return SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, 'react'))(
        tree,
      );
    }
    catch (errors) {
      this.props.errorHandler
        ? this.props.errorHandler(errors, children)
        : console.error(errors);
    }
    return null;
  }

  render() {
    return (
      <View style={[initialStyles.view, this.props.styles.view]}>
        {this._renderContent(this.props.children)}
      </View>
    );
  }
}

export default Markdown;
