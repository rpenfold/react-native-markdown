import React from 'react';
import { View } from 'react-native';
import { arrayOf, func, object, string } from 'prop-types';
import SimpleMarkdown from 'simple-markdown';
import assign from 'lodash/assign';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import pullAll from 'lodash/pullAll';

import { MarkdownProps } from './types';
import initialRules from './rules';
import initialStyles from './styles';

class Markdown extends React.Component<MarkdownProps> {
  static defaultProps: MarkdownProps = {
    blacklist: [],
    children: '',
    errorHandler: () => null,
    rules: {},
    styles: initialStyles,
    whitelist: [],
    onLinkPress: () => {},
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

  shouldComponentUpdate = (nextProps: MarkdownProps): boolean => (
    this.props.children !== nextProps.children ||
    this.props.styles !== nextProps.styles
  )

  // @TODO: Rewrite this part to prevent text from overriding other rules
  /** Post processes rules to strip out unwanted styling options
   *  while keeping the default 'paragraph' and 'text' rules
   */
  _postProcessRules = (preRules: object): object => {
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

  _renderContent = (children: string) => {
    try {
      const mergedStyles = assign({}, initialStyles, this.props.styles);
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
    const { children, styles } = this.props;

    return (
      <View style={[initialStyles.view, styles.view]}>
        {this._renderContent(children)}
      </View>
    );
  }
}

export default Markdown;
