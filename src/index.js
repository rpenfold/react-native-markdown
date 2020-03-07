/* @flow */

import React, { Component } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import SimpleMarkdown from 'simple-markdown'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import pullAll from 'lodash/pullAll'

import type { DefaultProps, Props } from './types'
import initialRules from './rules'
import initialStyles from './styles'

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
    blacklist: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.string,
    errorHandler: PropTypes.func,
    rules: PropTypes.object,
    styles: PropTypes.object,
    whitelist: PropTypes.arrayOf(PropTypes.string),
    onLinkPress: PropTypes.func,
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
    const defaultRules = ['paragraph', 'text']
    if (this.props.whitelist && this.props.whitelist.length) {
      return pick(preRules, [...this.props.whitelist, ...defaultRules])
    }
    else if (this.props.blacklist && this.props.blacklist.length) {
      return omit(preRules, pullAll(this.props.blacklist, defaultRules))
    }
    return preRules
  }

  _renderContent = (children: string): ?React$Element<any> => {
    try {
      const mergedStyles = Object.assign({}, initialStyles, this.props.styles)
      const rules = this._postProcessRules(
        merge(
          {},
          SimpleMarkdown.defaultRules,
          initialRules(mergedStyles, this.props),
          this.props.rules,
        ),
      )
      const child = Array.isArray(this.props.children)
        ? this.props.children.join('')
        : this.props.children
      // @TODO: Add another \n?
      const blockSource = `${child}\n`
      const tree = SimpleMarkdown.parserFor(rules)(blockSource, {
        inline: false,
      })
      return SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, 'react'))(
        tree,
      )
    }
    catch (errors) {
      this.props.errorHandler
        ? this.props.errorHandler(errors, children)
        : console.error(errors)
    }
    return null
  }

  render() {
    return (
      <View style={[initialStyles.view, this.props.styles.view]}>
        {this._renderContent(this.props.children)}
      </View>
    )
  }
}

export default Markdown
